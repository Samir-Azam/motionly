import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';
import { Playlist } from '../models/playlist.model.js';

export const searchAll = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    throw new ApiError(400, 'Search query is required');
  }

  const regex = new RegExp(query, 'i'); // case-insensitive

  // Search videos
  const videos = await Video.find({
    isPublished: true,
    $or: [{ title: regex }, { description: regex }]
  })
    .limit(20)
    .select('title thumbnail views owner');

  // Search users
  const users = await User.find({
    $or: [{ username: regex }, { fullName: regex }]
  })
    .limit(20)
    .select('username fullName avatar');

  // Search playlists
  const playlists = await Playlist.find({
    name: regex
  })
    .limit(20)
    .select('name description owner');

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        users,
        playlists
      },
      'Search results fetched successfully'
    )
  );
});
