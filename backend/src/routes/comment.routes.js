import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  addComment,
  getCommentsForVideo,
  getReplies,
  deleteComment,
  updateComment
} from '../controllers/comment.controllers.js';

const router = Router();

router.post('/add', verifyJWT, addComment);
router.get('/:videoId', getCommentsForVideo);
router.get('/replies/:commentId', getReplies);
router.delete('/:id', verifyJWT, deleteComment);
router.patch('/:id', verifyJWT, updateComment);

export default router;
