import { v2 as cloudinary } from "cloudinary";
import config from "config";

cloudinary.config({
  cloud_name: config.get("CLOUDINARY_NAME"),
  api_key: config.get("CLOUDINARY_API_KEY"),
  api_secret: config.get("CLOUDINARY_API_SECRET"),
});

export default cloudinary;
