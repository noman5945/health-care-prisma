import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import { NextFunction } from "express";

// Configuration
cloudinary.config({
  cloud_name: "diteprgh9",
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
});

const uploadImage = async (filePath: any) => {
  // Upload an image
  //console.log(filePath);
  const uploadResult = await cloudinary.uploader
    .upload(filePath.path, {
      public_id: filePath.filename,
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
  /*  
    Some Extra works...
    
  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("image", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("image", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
  */
};

export default uploadImage;
