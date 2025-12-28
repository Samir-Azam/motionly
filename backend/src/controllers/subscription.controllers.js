import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { toObjectId } from '../utils/helper.js';

export const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;

  if (!channelId) throw new ApiError(400, 'Channel ID is required');

  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot subscribe to yourself');
  }

  // Check if channel exists
  const channelExists = await User.exists({ _id: channelId });
  if (!channelExists) throw new ApiError(404, 'Channel not found');

  // Check existing subscription
  const existing = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId
  });

  let isSubscribed;

  if (existing) {
    // Unsubscribe
    await Subscription.findByIdAndDelete(existing._id);
    isSubscribed = false;

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isSubscribed }, 'Unsubscribed successfully')
      );
  }

  // Create new subscription
  await Subscription.create({
    subscriber: req.user._id,
    channel: channelId
  });

  isSubscribed = true;

  return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed }, 'Subscribed successfully'));
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;

  if (!channelId) throw new ApiError(400, 'Channel ID required');

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: toObjectId(channelId) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'subscriber',
        foreignField: '_id',
        as: 'subscriber',
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
    { $unwind: '$subscriber' }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, 'Subscribers list fetched'));
});

export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;

  const channels = await Subscription.aggregate([
    {
      $match: { subscriber: toObjectId(subscriberId) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
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
    { $unwind: '$channel' }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, channels, 'Subscribed channels fetched'));
});

export const isSubscribed = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;

  const exists = await Subscription.exists({
    subscriber: req.user._id,
    channel: channelId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed: !!exists }, 'Status fetched'));
});
