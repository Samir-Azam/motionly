import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto' // supports image, video, audio
    });

    // Remove file from server
    await fs.unlink(localFilePath);

    return response;
  } catch (error) {
    // Cleanup if something fails
    try {
      await fs.unlink(localFilePath);
    } catch (_) {}
    return null;
  }
};


export const deleteFromCloudinary = async (
  publicId,
  resourceType = 'image'
) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    return result;
  } catch (error) {
    console.log('Cloudinary delete error:', error.message);
    return null;
  }
};


