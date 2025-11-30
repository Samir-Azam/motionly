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


export const getFeedTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get IDs of channels the user subscribes to
  const subscriptions = await Subscription.find({ subscriber: userId }).select(
    'channel'
  );

  const channelIds = subscriptions.map((s) => s.channel);

  // Include user's own tweets
  channelIds.push(userId);

  const tweets = await Tweet.find({
    owner: { $in: channelIds }
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('owner', 'username fullName avatar');

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, 'Feed tweets fetched'));
});


export const getTweetsByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) throw new ApiError(404, "User not found");

  const tweets = await Tweet.find({ owner: user._id })
    .sort({ createdAt: -1 })
    .populate("owner", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
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
