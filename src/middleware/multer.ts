import multer from "multer";
import path from "path";

const whitelisted_image_file_extension = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
];

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
    //can also use the actual filename but na😒
    // cb(null, file.originalname)
  },
});

const upload = multer({
  storage,
  limits: {
    fieldNameSize: 120,
    fileSize: 5000000,
  },
  fileFilter: function (req, file, callback) {
    let extension = path.extname(file.originalname).toLowerCase();

    if (!whitelisted_image_file_extension.includes(extension)) {
      callback(new Error("File type is not supported"));

      return;
    }

    callback(null, true);
  },
});

export default upload;
