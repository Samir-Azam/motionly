import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createTweet,
  getFeedTweets,
  getTweetsByUsername,
  deleteTweet,
  toggleTweetLike
} from "../controllers/tweet.controllers.js";

const router = Router();

router.post("/", verifyJWT, createTweet);
router.get("/feed", verifyJWT, getFeedTweets);
router.get("/user/:username", verifyJWT, getTweetsByUsername);
router.delete("/:id", verifyJWT, deleteTweet);
router.post("/:id/like", verifyJWT, toggleTweetLike);

export default router;
