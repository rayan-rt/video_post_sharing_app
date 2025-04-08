import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// ----

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadOnCloudinary(localFilePath) {
  try {
    // Check if the file path is provided
    if (!localFilePath) {
      console.error("No file path provided");
      return null;
    }

    // Resolve the absolute path
    const resolvedFilePath = path.resolve(localFilePath);

    // Check if the file exists before proceeding
    const fileExists = fs.existsSync(resolvedFilePath);
    if (!fileExists) {
      console.error(`File does not exist: ${resolvedFilePath}`);
      return null;
    }

    // Upload the file to Cloudinary
    const res = await cloudinary.uploader.upload(resolvedFilePath, {
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
    });

    // Delete the local file after successful upload
    fs.unlinkSync(resolvedFilePath); // Now it's safe to delete the file
    console.log(`File uploaded successfully: ${res.url}`);

    return res;
  } catch (error) {
    console.error("Error during file upload:", error);

    if (fs.existsSync(resolvedFilePath)) {
      fs.unlinkSync(resolvedFilePath);
    }

    return null;
  }
}

async function deleteFromCloudinary(fileURL, resourceType = "image") {
  try {
    if (!fileURL) {
      console.error("No file URL provided");
      return false;
    }

    // Extract the public ID from the URL
    const filePublicID = fileURL.split("/").pop().split(".")[0];
    if (!filePublicID) {
      console.error("Unable to extract public ID from URL");
      return false;
    }

    const res = await cloudinary.uploader.destroy(filePublicID, {
      resource_type: resourceType, // Could be "image", "video", etc.
    });

    if (res.result === "ok") {
      console.log("File deleted successfully:", res);
      return true;
    } else {
      console.error("Error while deleting file from Cloudinary:", res);
      return false;
    }
  } catch (error) {
    console.error("Error during file deletion:", error);
    return false;
  }
}

export { uploadOnCloudinary, deleteFromCloudinary };
