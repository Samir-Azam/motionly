import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Like } from '../models/like.model.js';
import { toObjectId } from '../utils/helper.js';

export const toggleLike = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.body;

  if (!targetId || !targetType) {
    throw new ApiError(400, 'targetId and targetType are required');
  }

  if (!['video', 'comment', 'tweet'].includes(targetType)) {
    throw new ApiError(400, 'Invalid target type');
  }

  const userId = req.user?._id;

  const existingLike = await Like.findOne({
    likedBy: userId,
    targetId,
    targetType
  });

  // If like exists → UNLIKE
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, 'Unliked successfully'));
  }

  // If not exists → LIKE
  await Like.create({
    likedBy: userId,
    targetId,
    targetType
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, 'Liked successfully'));
});

export const getLikeCount = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.params;

  if (!targetId || !targetType) {
    throw new ApiError(400, 'targetId and targetType are required');
  }

  const count = await Like.countDocuments({
    targetId: toObjectId(targetId),
    targetType
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { count }, 'Like count fetched'));
});

export const isLikedByUser = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.params;

  const userId = req.user._id;

  const existing = await Like.exists({
    likedBy: userId,
    targetId: toObjectId(targetId),
    targetType
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { liked: Boolean(existing) }, 'Status fetched'));
});
