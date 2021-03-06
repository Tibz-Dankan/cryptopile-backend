const nodemailer = require("nodemailer");
const nodemailerMailgunTransport = require("nodemailer-mailgun-transport");
require("dotenv").config();

// function send verification link to user's email
const sendEmailVerificationLink = (userEmail, userId, verificationCode) => {
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
    from: `CryptoPile <${process.env.SENDERS_EMAIL}>`,
    to: `${userEmail}`,
    subject: "Email Confirmation",
    // html: `<p> click the button below to confirm your email and complete the registration process <br/><br/>
    //   <a href="http://localhost:3000/#/verify-user-email/?userId=${userId}&verificationCode=${verificationCode}"><button style="background-color:lightseagreen"> confirm email </button></a> <br/><br/> You received this email because you are signing up for <b> CryptoPile </b> </p>`,
    html: `<p> click the button below to confirm your email and complete the registration process <br/><br/>
      <a href="https://cryptopile.netlify.app/#/verify-user-email/?userId=${userId}&verificationCode=${verificationCode}"><button style="background-color:lightseagreen"> confirm email </button></a> <br/><br/> You received this email because you are signing up for <b> CryptoPile </b></p>`,
  };
  // send email
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(`error: ${error}`);
    } else {
      console.log(`Message sent`);
      console.log(data);
    }
    send;
  });
};
module.exports = { sendEmailVerificationLink };
