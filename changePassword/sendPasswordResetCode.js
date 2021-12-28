const nodemailer = require("nodemailer");
const nodemailerMailgunTransport = require("nodemailer-mailgun-transport");
require("dotenv").config();

// function send password code to user's email
const sendPasswordResetCode = (userEmail, passwordResetCode) => {
  const auth = {
    auth: {
      api_key: process.env.API_KEY,
      domain: process.env.DOMAIN,
    },
  };

  let transporter = nodemailer.createTransport(
    nodemailerMailgunTransport(auth)
  );
  // mail options
  const mailOptions = {
    from: "CryptoPile <cryptopile20@gmail.com>",
    to: `${userEmail}`,
    subject: "Password Reset Code",
    html: `<p>Your Password Reset code  is :<h1>${passwordResetCode}</h1>You received this email because are resetting password for  your CryptoPile account </p>`,
  };
  // send email
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(`error: ${error}`);
    } else {
      console.log(`Message sent`);
      console.log(data);
    }
  });
};
module.exports = { sendPasswordResetCode };
