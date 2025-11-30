import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  watchVideo,
  getWatchHistory
} from '../controllers/watch.controllers.js';

const router = Router();

// Watch video (logged in or not)
router.get('/:id', verifyJWT, watchVideo);

// User watch history (must be logged in)
router.get('/history/all', verifyJWT, getWatchHistory);

export default router;
