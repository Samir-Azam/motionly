import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
  deleteUser,
  getCurrentUser,
  getUserChannelProfile,
  resetPassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage
} from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { cleanupFiles } from '../middlewares/cleanup.middlewares.js';

const router = Router();

router.route('/').get((_, res) => {
  res.send('User route');
});

// Protected routes

router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/reset-password').post(verifyJWT, resetPassword);
router
  .route('/update-avatar')
  .patch(verifyJWT, upload.single('avatar'), cleanupFiles, updateAvatar);
router
  .route('/update-cover-image')
  .patch(
    verifyJWT,
    upload.single('coverImage'),
    cleanupFiles,
    updateCoverImage
  );
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router.route('/delete-account').delete(verifyJWT, deleteUser);

// Public route
router.route('/profile/:username').get(getUserChannelProfile);
export default router;
