import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';

export const searchAll = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    throw new ApiError(400, 'Search query is required');
  }

  const regex = new RegExp(query, 'i'); // case-insensitive

  // Search videos with populated owner
  const videos = await Video.find({
    isPublished: true,
    $or: [{ title: regex }, { description: regex }]
  })
    .populate('owner', 'username fullName avatar')
    .limit(20)
    .select('title thumbnail views owner duration createdAt')
    .sort({ createdAt: -1 });

  // Search users
  const users = await User.find({
    $or: [{ username: regex }, { fullName: regex }]
  })
    .limit(20)
    .select('username fullName avatar');

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        users
      },
      'Search results fetched successfully'
    )
  );
});
