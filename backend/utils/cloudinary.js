import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config();

async function uploadOnCloudinary(filePath) {
  try {
    if (!filePath) return null;
    const options = {
      resource_type: 'image',
    };
    const response = await cloudinary.uploader.upload(filePath, options);
    console.log('File path:', filePath);
    fs.unlinkSync(filePath);
    return response;
  } catch (err) {
    console.log(err.message);
    fs.unlinkSync(filePath);
    return null;
  }
}

export { uploadOnCloudinary };
