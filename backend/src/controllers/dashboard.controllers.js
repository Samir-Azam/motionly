import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { Subscription } from '../models/subscription.model.js';
import { Like } from '../models/like.model.js';
import { Playlist } from '../models/playlist.model.js';
import { Comment } from '../models/comment.model.js';

// dashboard.controllers.js
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get total videos
  const totalVideos = await Video.countDocuments({ owner: userId });

  // Get total subscribers (people who subscribed to this user's channel)
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId
  });

  // Get total likes on user's videos (FIXED)
  const videos = await Video.find({ owner: userId }).select('_id');
  const videoIds = videos.map((v) => v._id);

  const totalLikes = await Like.countDocuments({
    targetId: { $in: videoIds },
    targetType: 'video'
  });

  // Get total playlists
  const totalPlaylists = await Playlist.countDocuments({ owner: userId });

  // Get total views
  const viewsResult = await Video.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]);
  const totalViews = viewsResult[0]?.totalViews || 0;

  // Get recent uploads (last 10 videos)
  const recentUploads = await Video.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('owner', 'username fullName avatar');

  // Get recent comments on user's videos
  const recentComments = await Comment.find({
    video: { $in: videoIds }
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('owner', 'username fullName avatar')
    .populate('video', 'title');

  // ✅ Return in ApiResponse format
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalSubscribers,
        totalLikes,
        totalPlaylists,
        totalViews,
        recentUploads,
        recentComments
      },
      'Dashboard stats fetched successfully'
    )
  );
});
