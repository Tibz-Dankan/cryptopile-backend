const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

// function send verification link to user's email
const sendVerificationEmail = (userEmail) => {
  let userVerificationId = math.floor(math.random() * 100 + 45);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tibesigwadankan@gmail.com",
      pass: "my-password",
    },
  });
  // mail options
  const mailOptions = {
    from: "tibesigwadankan@gmail.com",
    to: `${userEmail}`,
    subject: "Email Confirmation",
    html: `Please click  ${(
      <a href="https://stockpile-frontend.netlify.app/verify-email">here</a>
    )} to verify email,`,
  };
  // send email
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log("Message sent");
      console.log(data.response);
      res.send(data.response);
    }
  });
};

// route to verify the user email
(module.exports = app), { sendVerificationEmail };
