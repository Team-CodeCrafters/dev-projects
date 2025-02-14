import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config();

async function uploadOnCloudinary(files) {
  if (!files) return null;
  try {
    let cloudinaryImageUrls = [];

    for (const file of files) {
      const options = {
        resource_type: 'auto',
      };
      const response = await cloudinary.uploader.upload(file.path, options);
      fs.unlinkSync(file.path);
      cloudinaryImageUrls.push(response.secure_url);
    }

    return cloudinaryImageUrls;
  } catch (error) {
    console.log("file upload error", error.message)
    return null;
  } finally {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
}

export { uploadOnCloudinary };
