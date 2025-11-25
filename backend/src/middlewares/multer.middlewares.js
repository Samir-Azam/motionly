import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    const safeName = file.originalname.replace(/\s+/g, '_');

    cb(null, `${safeName}-${uniqueSuffix}`);
  }
});

export const upload = multer({ storage });
