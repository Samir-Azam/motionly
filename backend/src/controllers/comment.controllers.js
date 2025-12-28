import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from '../models/comment.model.js';
import { toObjectId } from '../utils/helper.js';

export const addComment = asyncHandler(async (req, res) => {
  const { videoId, content, parentComment } = req.body;

  if (!videoId || !content?.trim()) {
    throw new ApiError(400, 'videoId and content are required');
  }

  const comment = await Comment.create({
    video: toObjectId(videoId),
    owner: req.user._id,
    content,
    parentComment: parentComment ? toObjectId(parentComment) : null
  });

  // ✅ Populate owner before returning
  const populatedComment = await Comment.findById(comment._id).populate(
    'owner',
    'username fullName avatar'
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedComment, 'Comment added successfully'));
});

export const getCommentsForVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(400, 'Video ID required');

  const comments = await Comment.aggregate([
    {
      $match: {
        video: toObjectId(videoId),
        parentComment: null
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    { $unwind: '$owner' },
    // ✅ Added: Count replies for each comment
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'parentComment',
        as: 'replies'
      }
    },
    {
      $addFields: {
        replyCount: { $size: '$replies' }
      }
    },
    {
      $project: {
        replies: 0 // Don't send the actual replies, just the count
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, 'Comments fetched'));
});

export const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) throw new ApiError(400, 'Comment ID required');

  const replies = await Comment.aggregate([
    {
      $match: {
        parentComment: toObjectId(commentId)
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    { $unwind: '$owner' },
    { $sort: { createdAt: 1 } } // oldest first
  ]);

  return res.status(200).json(new ApiResponse(200, replies, 'Replies fetched'));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) throw new ApiError(404, 'Comment not found');

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this comment');
  }

  // Delete all nested replies first
  await Comment.deleteMany({ parentComment: id });

  // Delete the comment
  await Comment.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Comment deleted successfully'));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, 'Content is required');
  }

  const comment = await Comment.findById(id);

  if (!comment) throw new ApiError(404, 'Comment not found');

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update');
  }

  comment.content = content;
  await comment.save();

  // ✅ Populate owner before returning
  const updatedComment = await Comment.findById(id).populate(
    'owner',
    'username fullName avatar'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, 'Comment updated'));
});
