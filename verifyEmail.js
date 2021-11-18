const nodemailer = require("nodemailer");

// function send verification link to user's email
const sendVerificationEmail = (userEmail, userVerificationId) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tibesigwadankan@gmail.com",
      pass: "tibs@fe20",
    },
  });
  // <a href="https://stockpile-frontend.netlify.app/verify-email">here</a>
  // mail options
  const mailOptions = {
    from: "tibesigwadankan@gmail.com",
    to: `${userEmail}`,
    subject: "Email Confirmation",
    html: `Your verification code  is <h1> ${userVerificationId} </h1>`,
  };
  // send email
  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(error);
      // res.send(error);
    } else {
      console.log("Message sent");
      // console.log(data.response);
      // res.send(data.response);
    }
  });
};

// route to verify the user email
// continue reasoning from here next time
module.exports = { sendVerificationEmail };
