import fs from 'fs/promises';
import logger from '../config/logger.js';

export const cleanupFiles = (req, res, next) => {
  // 'finish' event runs AFTER the response has been sent
  res.on('finish', async () => {
    // Delete files ONLY if request failed (status >= 400)
    if (res.statusCode >= 400) {
      try {
        if (req.files?.avatar?.[0]) {
          await fs.unlink(req.files.avatar[0].path);
        }
        if (req.files?.coverImage?.[0]) {
          await fs.unlink(req.files.coverImage[0].path);
        }
      } catch (err) {
        logger.error('File cleanup error:', err.message);
      }
    }
  });
  next(); // pass control to next middleware/controller
};
