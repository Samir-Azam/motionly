import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  watchVideo,
  getWatchHistory,
  clearWatchHistory
} from '../controllers/watch.controllers.js';

const router = Router();

// Get watch history
router.get('/', verifyJWT, getWatchHistory);

// Mark video as watched
router.post('/:id', verifyJWT, watchVideo);

// Clear all watch history
router.delete('/clear', verifyJWT, clearWatchHistory);

export default router;
