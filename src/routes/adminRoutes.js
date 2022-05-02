const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  adminGetUsers,
  getAdminProfile,
  adminVerifyUser,
  adminDeleteUser,
} = require("../controllers/adminController");

const router = express.Router();
router.get("/get-user-accounts", verifyToken, adminGetUsers);

router.get("/get-admin-profile", verifyToken, getAdminProfile);

router.put("/admin-verify-user/:userId", verifyToken, adminVerifyUser);

router.delete("/admin-delete-user/:userId", verifyToken, adminDeleteUser);

module.exports = router;
