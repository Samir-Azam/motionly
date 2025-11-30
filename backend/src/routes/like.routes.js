import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { toggleLike, getLikeCount, isLikedByUser } from "../controllers/like.controllers.js";

const router = Router();

// Toggle Like/Unlike
router.post("/toggle", verifyJWT, toggleLike);

// Get total likes on video/comment/tweet
router.get("/count/:targetType/:targetId", getLikeCount);

// Check if user liked
router.get("/status/:targetType/:targetId", verifyJWT, isLikedByUser);

export default router;
