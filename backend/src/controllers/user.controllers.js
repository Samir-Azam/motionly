import validator from 'validator';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Video } from '../models/video.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Subscription } from '../models/subscription.model.js';
import { WatchHistory } from '../models/watchHistory.model.js';
import { Comment } from '../models/comment.model.js';
import { Like } from '../models/like.model.js';
import { Playlist } from '../models/playlist.model.js';
import { Tweet } from '../models/tweet.model.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'User fetched successfully'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'All fields are mandatory');
  }

  if (
    !validator.isStrongPassword(newPassword, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0
    })
  ) {
    throw new ApiError(400, 'Password is not strong enough');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isValidPassword = await user.comparePassword(oldPassword);

  if (!isValidPassword) {
    throw new ApiError(400, 'Wrong password');
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password updated successfully'));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  // 1. New avatar file must exist
  const localAvatarPath = req?.file?.path;

  if (!localAvatarPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  // 3. Upload new avatar
  const uploadedAvatar = await uploadOnCloudinary(localAvatarPath);

  if (!uploadedAvatar) {
    throw new ApiError(500, 'Avatar upload failed');
  }

  // 4. Update user record
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: uploadedAvatar.secure_url },
    { new: true }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'Avatar updated successfully'));
});

export const updateCoverImage = asyncHandler(async (req, res) => {
  // 1. New cover image must exist
  const localCoverPath = req?.file?.path;

  if (!localCoverPath) {
    throw new ApiError(400, 'Cover image is required');
  }

  // 3. Upload new cover image
  const uploadedCover = await uploadOnCloudinary(localCoverPath);

  if (!uploadedCover) {
    throw new ApiError(500, 'Cover image upload failed');
  }

  // 4. Update user record
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { coverImage: uploadedCover.secure_url },
    { new: true }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, 'Cover image updated successfully')
    );
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;

  // Require at least one field
  if (!fullName && !email && !username) {
    throw new ApiError(400, 'At least one field is required');
  }

  const updates = {};

  // FULL NAME
  if (fullName) {
    if (fullName.trim().length < 3) {
      throw new ApiError(400, 'Full name must be at least 3 characters');
    }
    updates.fullName = fullName;
  }

  // EMAIL
  if (email) {
    if (!validator.isEmail(email)) {
      throw new ApiError(400, 'Provide a correct email');
    }

    // Check duplicate email (except current user)
    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user._id }
    });
    if (emailExists) {
      throw new ApiError(409, 'Email already in use');
    }

    updates.email = email;
  }

  // USERNAME
  if (username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(username)) {
      throw new ApiError(
        400,
        'Username must be 3–20 characters and alphanumeric'
      );
    }

    // Check duplicate username (except current user)
    const usernameExists = await User.findOne({
      username,
      _id: { $ne: req.user._id }
    });

    if (usernameExists) {
      throw new ApiError(409, 'Username already taken');
    }

    updates.username = username;
  }

  // SINGLE database update
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, 'Account details updated successfully')
    );
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, 'Username is required');
  }

  // Find user
  const channel = await User.findOne({ username }).select(
    '-password -refreshToken'
  );

  if (!channel) {
    throw new ApiError(404, 'Channel not found');
  }

  const channelId = channel._id;

  // Count subscribers (people who subscribe to this channel)
  const subscriberCount = await Subscription.countDocuments({
    channel: channelId
  });

  // Count channels user is subscribed to
  const subscribedToCount = await Subscription.countDocuments({
    subscriber: channelId
  });

  // Does logged-in user follow this channel?
  let isSubscribed = false;

  if (req.user) {
    const subscriptionExists = await Subscription.exists({
      subscriber: req.user._id,
      channel: channelId
    });

    isSubscribed = Boolean(subscriptionExists);
  }

  // Video count
  const videoCount = await Video.countDocuments({ owner: channelId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channel,
        subscriberCount,
        subscribedToCount,
        isSubscribed,
        videoCount
      },
      'Channel profile fetched'
    )
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  if (!userId) {
    throw new ApiError(401, 'User not logged in');
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Delete all user-related data in parallel
  await Promise.all([
    Video.deleteMany({ owner: userId }),
    Subscription.deleteMany({
      $or: [{ subscriber: userId }, { channel: userId }]
    }),
    Comment.deleteMany({ owner: userId }),
    Like.deleteMany({ likedBy: userId }),
    Playlist.deleteMany({ owner: userId }),
    Tweet.deleteMany({ owner: userId }),
    WatchHistory.deleteMany({ user: userId })
  ]);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User deleted successfully'));
});
