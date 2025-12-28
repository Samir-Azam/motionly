import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Tweet } from '../models/tweet.model.js';
import { User } from '../models/user.model.js';
import { Like } from '../models/like.model.js';
import { Subscription } from '../models/subscription.model.js';

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, 'Tweet content is required');
  }

  if (content.length > 280) {
    throw new ApiError(400, 'Tweet cannot exceed 280 characters');
  }

  const tweet = await Tweet.create({
    owner: req.user._id,
    content
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, 'Tweet posted successfully'));
});


// Get ALL tweets (public feed for "All Tweets" tab)
export const getFeedTweets = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Get all tweets from everyone
  const tweets = await Tweet.find()
    .populate('owner', 'username fullName avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Tweet.countDocuments();

  return res.status(200).json(
    new ApiResponse(200, {
      docs: tweets,
      page,
      limit,
      totalDocs: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }, 'All tweets fetched successfully')
  );
});

// Get personalized feed (only subscribed channels)
// tweet.controllers.js
export const getPersonalizedFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Get IDs of channels the user subscribes to
  const subscriptions = await Subscription.find({ subscriber: userId }).select('channel');
  const channelIds = subscriptions.map((s) => s.channel);

  // ✅ Don't include user's own tweets - only subscribed channels
  // Remove this line: channelIds.push(userId);

  // If no subscriptions, return empty
  if (channelIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        docs: [],
        page,
        limit,
        totalDocs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }, 'No subscriptions yet')
    );
  }

  const tweets = await Tweet.find({
    owner: { $in: channelIds }
  })
    .populate('owner', 'username fullName avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Tweet.countDocuments({ owner: { $in: channelIds } });

  return res.status(200).json(
    new ApiResponse(200, {
      docs: tweets,
      page,
      limit,
      totalDocs: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }, 'Following feed fetched successfully')
  );
});


export const getTweetsByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (!username) {
    throw new ApiError(400, 'Username is required');
  }

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const tweets = await Tweet.find({ owner: user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('owner', 'username fullName avatar');

  const total = await Tweet.countDocuments({ owner: user._id });

  // ✅ Return in SAME format as getTweetFeed and getPersonalizedFeed
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        docs: tweets, // ✅ Must be 'docs'
        page,
        limit,
        totalDocs: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      'User tweets fetched successfully'
    )
  );
});


export const deleteTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tweet = await Tweet.findById(id);

  if (!tweet) throw new ApiError(404, 'Tweet not found');

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this tweet');
  }

  await Tweet.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Tweet deleted successfully'));
});


export const toggleTweetLike = asyncHandler(async (req, res) => {
  const { id: tweetId } = req.params;

  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    targetId: tweetId,
    targetType: 'tweet'
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(new ApiResponse(200, {}, 'Tweet unliked'));
  }

  await Like.create({
    likedBy: req.user._id,
    targetId: tweetId,
    targetType: 'tweet'
  });

  return res.status(201).json(new ApiResponse(201, {}, 'Tweet liked'));
});
