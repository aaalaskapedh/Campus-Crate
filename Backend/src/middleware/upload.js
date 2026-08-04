const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Tells multer to stream uploaded files straight to Cloudinary
// instead of saving them to our server's disk first.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campuscrate/items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // cap image size
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
