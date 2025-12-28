import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Like } from '../models/like.model.js';
import { Video } from '../models/video.model.js';
import { Comment } from '../models/comment.model.js';
import { toObjectId } from '../utils/helper.js';

export const toggleLike = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.body;
  const userId = req.user?._id;

  if (!targetId) throw new ApiError(400, 'Target id is required');
  if (!targetType) throw new ApiError(400, 'Target type is required');
  if (!userId) throw new ApiError(401, 'Not logged in');

  // Validate targetType
  const validTypes = ['video', 'comment', 'tweet'];
  if (!validTypes.includes(targetType)) {
    throw new ApiError(400, 'Invalid target type');
  }

  // Check if like already exists
  const existingLike = await Like.findOne({
    targetId: toObjectId(targetId),
    targetType,
    likedBy: userId
  });

  let message;
  let isLiked;

  if (existingLike) {
    // Unlike: Remove like
    await Like.findByIdAndDelete(existingLike._id);
    message = `${targetType} unliked successfully`;
    isLiked = false;
  } else {
    // Like: Create new like
    await Like.create({
      targetId: toObjectId(targetId),
      targetType,
      likedBy: userId
    });
    message = `${targetType} liked successfully`;
    isLiked = true;
  }

  // Get updated like count
  const likeCount = await Like.countDocuments({
    targetId: toObjectId(targetId),
    targetType
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked, likeCount }, message));
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
    .json(new ApiResponse(200, { likeCount: count }, 'Like count fetched'));
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
    .json(
      new ApiResponse(200, { isLiked: Boolean(existing) }, 'Status fetched')
    );
});
