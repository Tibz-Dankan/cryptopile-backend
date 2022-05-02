const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  signup,
  login,
  verifyUser,
  getUserProfile,
  forgotPassword,
  passwordResetCode,
  updatePassword,
  reSendVerificationLink,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-user-email/:id", verifyUser);
router.get("/get-user-info/:userId", verifyToken, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/password-reset-code", passwordResetCode);
router.put("/reset-password/:userId", updatePassword);
router.post("/resend-verification-link", reSendVerificationLink);

module.exports = router;
