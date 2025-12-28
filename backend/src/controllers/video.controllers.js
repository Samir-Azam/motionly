import mongoose from 'mongoose';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { toObjectId } from '../utils/helper.js';

export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title?.trim() || !duration) {
    throw new ApiError(400, 'Title and duration are required');
  }

  if (isNaN(duration)) {
    throw new ApiError(400, 'Duration must be a number');
  }

  // Correct multer keys
  const videoLocalPath = req.files?.video?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, 'Video and thumbnail are required');
  }

  const videoUpload = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoUpload || !thumbnailUpload) {
    throw new ApiError(500, 'Upload failed');
  }

  const video = await Video.create({
    owner: req.user._id,
    title,
    description,
    duration,
    videoFile: videoUpload.secure_url,
    thumbnail: thumbnailUpload.secure_url,
    isPublished: true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, 'Video uploaded successfully'));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Valid video id is required');
  }

  const video = await Video.aggregate([
    {
      $match: { _id: toObjectId(id) }
    },
    {
      $lookup: {
        from: 'users',
        let: { ownerId: '$owner' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$ownerId'] } } },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1
            }
          }
        ],
        as: 'owner'
      }
    },
    { $unwind: '$owner' },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        owner: 1,
        createdAt: 1
      }
    }
  ]);

  if (!video.length) throw new ApiError(404, 'Video not found');

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], 'Video fetched successfully'));
});

export const getAllVideos = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const pipeline = [
    { $match: { isPublished: true } },
    {
      $lookup: {
        from: 'users',
        let: { ownerId: '$owner' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$ownerId'] } } },
          { $project: { username: 1, avatar: 1, fullName: 1 } }
        ],
        as: 'owner'
      }
    },
    { $unwind: '$owner' },
    { $sort: { createdAt: -1 } }
  ];

  const options = { page, limit };

  const results = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, results, 'Videos fetched successfully'));
});

export const getVideoByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) throw new ApiError(400, 'Username is required');

  const user = await User.findOne({ username }).select('_id');

  if (!user) throw new ApiError(404, 'User not found');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const pipeline = [
    {
      $match: {
        owner: user._id,
        isPublished: true
      }
    },
    {
      $lookup: {
        from: 'users',
        let: { ownerId: '$owner' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$ownerId'] } } },
          { $project: { username: 1, avatar: 1, fullName: 1 } }
        ],
        as: 'owner'
      }
    },
    { $unwind: '$owner' },
    { $sort: { createdAt: -1 } }
  ];

  const options = { page, limit };

  const results = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, results, 'Channel videos fetched successfully'));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid video id');
  }

  if (!title && !description && !thumbnailLocalPath) {
    throw new ApiError(400, 'At least one field is required');
  }

  const video = await Video.findById(id);

  if (!video) throw new ApiError(404, 'Video not found');

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not allowed to update this video');
  }

  let newThumbnail = video.thumbnail;

  if (thumbnailLocalPath) {
    const uploaded = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploaded) throw new ApiError(500, 'Thumbnail upload failed');
    newThumbnail = uploaded.secure_url;
  }

  const updates = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (thumbnailLocalPath) updates.thumbnail = newThumbnail;

  const updatedVideo = await Video.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, 'Video updated successfully'));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid video id');
  }

  const video = await Video.findById(id);

  if (!video) throw new ApiError(404, 'Video not found');

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not allowed to delete this video');
  }

  await Video.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Video deleted successfully'));
});
