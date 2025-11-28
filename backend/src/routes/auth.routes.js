import { Router } from 'express';
import { upload } from '../middlewares/multer.middlewares.js';
import { login, logout, refreshAccessToken, registerUser } from '../controllers/auth.controllers.js';
import { cleanupFiles } from '../middlewares/cleanup.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  cleanupFiles,
  registerUser
);

router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout)
router.route("/refresh-token").post(refreshAccessToken)

export default router;
