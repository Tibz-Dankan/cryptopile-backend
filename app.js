const express = require("express");
const register = require("./account/register");
const pile = require("./pile");
const forgotPassword = require("./forgotPassword");
const passwordResetCode = require("./passwordResetCode");
const resetPassword = require("./resetPassword");
const resendVerificationLink = require("./account/resendVerificationLink");
const app = express();
const fileuploads = require("./fileupload");
const secretes = require("./secretes");
const { memoryUsage } = require("./memoryUsage");

app.use("/", fileuploads);
// Register a new user
app.use("/", register);

// The pile section
app.use("/", pile);

// password reset section
// forgot password
app.use("/", forgotPassword);
//password reset code
app.use("/", passwordResetCode);
// resetting the password
app.use("/", resetPassword);
// resending the verification link
app.use("/", resendVerificationLink);

// The user secretes
app.use("/", secretes);
// call the memory usage function here
memoryUsage();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);
