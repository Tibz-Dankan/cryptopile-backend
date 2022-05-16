const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  adminGetUsers,
  getAdminProfile,
  adminVerifyUser,
  adminDeleteUser,
  createAdmin,
  logInAdmin,
  generateAdminKey,
  getAdminKeys,
  verifyAdminKey,
} = require("../controllers/adminController");

const router = express.Router();
router.get("/get-user-accounts", verifyToken, adminGetUsers);
router.get("/get-admin-profile/:userId", verifyToken, getAdminProfile);
router.put("/admin-verify-user/:userId", verifyToken, adminVerifyUser);
router.delete("/admin-delete-user/:userId", verifyToken, adminDeleteUser);
router.post("/signup-admin", createAdmin);
router.post("/login-admin", logInAdmin);
router.post(
  "/generate-admin-key/:generatedById",
  verifyToken,
  generateAdminKey
);
router.get("/get-admin-key/:userId", verifyToken, getAdminKeys);
router.post("/verify-admin-key", verifyAdminKey);

module.exports = router;
