import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate tokens');
  }
};

export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookies
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  // Verify token first
  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Find user
  const user = await User.findById(decoded._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Match stored refreshToken with incoming one
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token mismatch');
  }

  // Create new tokens
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  const safeUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(new ApiResponse(200, safeUser, 'Token refreshed successfully'));
});

export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  // Basic required fields
  if ([username, fullName, email, password].some((field) => !field)) {
    throw new ApiError(400, 'All fields are required');
  }

  // Email validation
  if (!validator.isEmail(email)) {
    throw new ApiError(400, 'Provide a correct email');
  }

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    throw new ApiError(
      400,
      'Username must be 3–20 characters and alphanumeric'
    );
  }

  // Password validation
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0
    })
  ) {
    throw new ApiError(
      400,
      'Password must include at least: 1 letter & 1 number'
    );
  }

  // Full name validation
  if (fullName.trim().length < 3) {
    throw new ApiError(400, 'Full name must be at least 3 characters');
  }

  // Avatar existence check FIRST
  if (!req.files?.avatar?.[0]) {
    throw new ApiError(400, 'Avatar is required');
  }

  // Avatar type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.files.avatar[0].mimetype)) {
    throw new ApiError(400, 'Avatar must be JPG, PNG, or WEBP');
  }

  // Check duplicates
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });
  if (existingUser) {
    throw new ApiError(409, 'User with this email or username already exists');
  }

  // Paths
  const avatarLocalPath = req.files.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Upload avatar
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUpload) {
    throw new ApiError(500, 'Avatar upload failed');
  }

  // Optional coverImage
  const coverImageUpload = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Create user
  const user = await User.create({
    username,
    fullName,
    email,
    password,
    avatar: avatarUpload.secure_url,
    coverImage: coverImageUpload?.secure_url || ''
  });

  // Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, 'Username or email is required');
  }

  if (!password) {
    throw new ApiError(400, 'Password is mandatory');
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  }).select('+password'); // Because password is select:false

  if (!user) {
    throw new ApiError(400, "Account doesn't exist. Register first");
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new ApiError(400, 'Wrong password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // remove password & refresh token from response
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, loggedInUser, 'Login successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'Logout successfully'));
});

