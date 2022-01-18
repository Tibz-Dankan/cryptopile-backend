const express = require("express");
const signup = require("./account/signup");
const login = require("./account/login");
const verifyUserAccount = require("./account/verifyUserAccount");
const resendVerificationLink = require("./account/resendVerificationLink");
const pile = require("./pile");
const forgotPassword = require("./changePassword/forgotPassword");
const passwordResetCode = require("./changePassword/passwordResetCode");
const resetPassword = require("./changePassword/resetPassword");
const app = express();
const fileuploads = require("./fileupload");
const secretes = require("./secretes");
const admin = require("./admin/admin");
const { memoryUsage } = require("./memoryUsage");

app.use("/", fileuploads);
// signup a new user
app.use("/", signup);
// login a user
app.use("/", login);
// verify user account
app.use("/", verifyUserAccount);

// resending the verification link
app.use("/", resendVerificationLink);

// The pile section
app.use("/", pile);

// password reset section
// forgot password
app.use("/", forgotPassword);
//password reset code
app.use("/", passwordResetCode);
// resetting the password
app.use("/", resetPassword);

// admin
app.use("/", admin);

// The user secretes
app.use("/", secretes);
// call the memory usage function here
memoryUsage();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);
