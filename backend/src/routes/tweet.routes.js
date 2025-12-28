import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createTweet,
  getFeedTweets,
  getPersonalizedFeed, // ✅ Add this
  getTweetsByUsername,
  deleteTweet,
  toggleTweetLike
} from "../controllers/tweet.controllers.js";

const router = Router();

// Public/semi-public routes
router.get("/feed", getFeedTweets); // ✅ All tweets (no auth required)
router.get("/following", verifyJWT, getPersonalizedFeed); // ✅ Only subscribed channels

// Other routes
router.post("/", verifyJWT, createTweet);
router.get("/user/:username", getTweetsByUsername);
router.delete("/:id", verifyJWT, deleteTweet);
router.post("/:id/like", verifyJWT, toggleTweetLike);

export default router;
