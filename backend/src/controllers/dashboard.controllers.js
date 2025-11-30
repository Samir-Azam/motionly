import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Video } from '../models/video.model.js';
import { Subscription } from '../models/subscription.model.js';
import { Like } from '../models/like.model.js';
import { Playlist } from '../models/playlist.model.js';
import { Comment } from '../models/comment.model.js';
import { WatchHistory } from '../models/watchHistory.model.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch total videos uploaded
  const totalVideos = await Video.countDocuments({ owner: userId });

  // 2. Total subscribers (people who follow this channel)
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId
  });

  // 3. Total channels user is subscribed to
  const subscribedTo = await Subscription.countDocuments({
    subscriber: userId
  });

  // 4. Total likes received across ALL videos + tweets + comments
  const totalLikesReceived = await Like.countDocuments({
    targetType: 'video',
    targetId: { $in: await Video.find({ owner: userId }).distinct('_id') }
  });

  // 5. Playlist count
  const totalPlaylists = await Playlist.countDocuments({ owner: userId });

  // 6. Recent uploads (last 5 videos)
  const recentUploads = await Video.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  // 7. Recent comments by user
  const recentComments = await Comment.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('video', 'title thumbnail');

  // 8. Recent watch history (last 5 watched videos)
  const recentWatched = await WatchHistory.find({ user: userId })
    .sort({ watchedAt: -1 })
    .limit(5)
    .populate('video', 'title thumbnail duration');

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totals: {
          videos: totalVideos,
          subscribers: totalSubscribers,
          subscribedTo,
          likesReceived: totalLikesReceived,
          playlists: totalPlaylists
        },
        recent: {
          uploads: recentUploads,
          comments: recentComments,
          watched: recentWatched
        }
      },
      'Dashboard stats fetched successfully'
    )
  );
});
