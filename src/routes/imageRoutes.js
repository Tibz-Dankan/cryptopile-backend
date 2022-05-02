const express = require("express");
const { uploadUserProfileImage } = require("../controllers/imageController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post(
  "/api/upload-profile-image-url/:userId",
  verifyToken,
  uploadUserProfileImage
);

module.exports = router;
