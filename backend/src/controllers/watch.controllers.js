import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { WatchHistory } from '../models/watchHistory.model.js';
import { toObjectId } from '../utils/helper.js';

// Watch a video (increment views + add to history)
export const watchVideo = asyncHandler(async (req, res) => {
  const videoId = req.params?.id;
  const userId = req.user?._id;

  if (!videoId) throw new ApiError(400, 'Video id is required');

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, 'Video not found');

  let shouldIncrementView = true;

  // If user is logged in, check if they watched recently (within last 24 hours)
  if (userId) {
    const existingWatch = await WatchHistory.findOne({
      user: userId,
      video: videoId
    });

    if (existingWatch) {
      const timeSinceLastWatch =
        Date.now() - new Date(existingWatch.watchedAt).getTime();
      const hoursElapsed = timeSinceLastWatch / (1000 * 60 * 60);

      // Only increment view if more than 24 hours passed
      if (hoursElapsed < 24) {
        shouldIncrementView = false;
      }
    }

    // Update watch history
    await WatchHistory.findOneAndUpdate(
      { user: userId, video: videoId },
      {
        user: userId,
        video: videoId,
        watchedAt: new Date()
      },
      { upsert: true, new: true }
    );
  }

  // Increment view count only if needed
  if (shouldIncrementView) {
    video.views = (video.views || 0) + 1;
    await video.save();
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        video,
        viewIncremented: shouldIncrementView
      },
      'Video watched successfully'
    )
  );
});
  
// Get user's watch history with pagination
export const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, 'Not logged in');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const pipeline = [
    { $match: { user: toObjectId(userId) } },
    { $sort: { watchedAt: -1 } },
    {
      $lookup: {
        from: 'videos',
        localField: 'video',
        foreignField: '_id',
        as: 'video',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1
                  }
                }
              ]
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
              createdAt: 1,
              owner: 1
            }
          }
        ]
      }
    },
    { $unwind: '$video' },
    {
      $project: {
        video: 1,
        watchedAt: 1
      }
    }
  ];

  const options = { page, limit };

  const history = await WatchHistory.aggregatePaginate(
    WatchHistory.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, history, 'Watch history fetched successfully'));
});

// Clear all watch history for user
export const clearWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, 'Not logged in');

  const result = await WatchHistory.deleteMany({ user: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        'Watch history cleared successfully'
      )
    );
});
