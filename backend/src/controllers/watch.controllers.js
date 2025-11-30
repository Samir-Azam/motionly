
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/video.model.js';
import { WatchHistory } from '../models/watchHistory.model.js';
import { toObjectId } from '../utils/helper.js';

export const watchVideo = asyncHandler(async (req, res) => {
  const videoId = req.params?.id;
  const userId = req.user?._id;

  if (!videoId) throw new ApiError(400, 'Video id is required');

  // 1. Find video
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, 'Video not found');

  // 2. Increase view count
  video.views = (video.views || 0) + 1;
  await video.save({ validateBeforeSave: false });

  // 3. Track watch history only if user is logged in
  if (userId) {
    const existing = await WatchHistory.findOne({
      user: userId,
      video: videoId
    });

    if (existing) {
      // Already exists → update watchedAt
      existing.watchedAt = new Date();
      await existing.save({ validateBeforeSave: false });
    } else {
      // Create new history entry
      await WatchHistory.create({
        user: userId,
        video: videoId
      });
    }
  }

  return res.status(200).json(new ApiResponse(200, video, 'Video watched'));
});

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
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              duration: 1,
              views: 1,
              createdAt: 1
            }
          }
        ]
      }
    },
    { $unwind: '$video' }
  ];

  const options = { page, limit };

  const history = await WatchHistory.aggregatePaginate(
    WatchHistory.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, history, 'Watch history fetched'));
});
