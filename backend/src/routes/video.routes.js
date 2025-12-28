import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { upload } from '../middlewares/multer.middlewares.js';
import {
  uploadVideo,
  getVideoById,
  getAllVideos,
  getVideoByUsername,
  updateVideo,
  deleteVideo
} from '../controllers/video.controllers.js';
import { cleanupFiles } from '../middlewares/cleanup.middlewares.js';

const router = Router();

router.get('/', (_, res) => {
  res.send('Video routes working');
});

// ✅ UPLOAD - Keep at top
router.post(
  '/upload',
  verifyJWT,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  cleanupFiles,
  uploadVideo
);

router.get('/feed/all', getAllVideos);              
router.get('/user/:username', getVideoByUsername);  

// ✅ UPDATE/DELETE - Specific paths
router.patch(
  '/update/:id',
  verifyJWT,
  upload.single('thumbnail'),
  cleanupFiles,
  updateVideo
);

router.delete('/delete/:id', verifyJWT, deleteVideo);

router.get('/:id', getVideoById);  

export default router;
