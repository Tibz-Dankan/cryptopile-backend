const express = require("express");
const pool = require("./dbConfig");
const { sendEmailVerificationLink } = require("./sendVerificationEmail");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailExistence = require("email-existence");
require("dotenv").config();
const app = express();
app.use(express.json());
// app.use(cors({ origin: "https://cryptopile.netlify.app" }));
app.use(cors());

// get username for the profile and send to the frontend
app.get("/api/getusername/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sqlQuery1 =
      "SELECT firstname, lastname  FROM registers WHERE id = $1";
    await pool.connect();
    const response = await pool.query(sqlQuery1, [userId]);
    const sendUserName = res.json(response.rows[0]);
    console.log(sendUserName);
  } catch (error) {
    console.log(error);
  }
});

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { gender } = req.body;
    const { password } = req.body;
    const { isVerifiedEmail } = req.body;
    const emailVerificationCode = Math.floor(Math.random() * 1000000);

    emailExistence.check(email, (error, response) => {
      if (error) {
        res.send({
          emailValidationMsg:
            "Sorry, an error occurred during process of checking this email's existence ",
        });
        console.log(error);
      } else {
        if (response) {
          // function to register a new user
          registerNewUserDetails(
            firstName,
            lastName,
            email,
            gender,
            password,
            isVerifiedEmail,
            emailVerificationCode,
            res
          );
          // console log email validity
          console.log("Email validity is :" + response);
        } else {
          res.send({
            emailValidationMsg:
              "It looks like this email does not exists or it is invalid !",
          });
        }
      }
    });

    // some curly brace removed from here
  } catch (err) {
    console.error(err);
  }
});

//  function  to register new user here
const registerNewUserDetails = async (
  firstName,
  lastName,
  email,
  gender,
  password,
  isVerifiedEmail,
  emailVerificationCode,
  res
) => {
  //  store user and send verification link to his/her email
  const sqlQuery = "SELECT * FROM registers WHERE email = $1";
  const checkEmailInDatabase = await pool.query(sqlQuery, [email]);
  if (checkEmailInDatabase.rows.length > 0) {
    res.send({ emailValidationMsg: "This email already registered !" });
  } else {
    // Store the user details into the database
    const hashedPassword = await bcrypt.hash(password, 10); // hashing password
    const sqlQuery2 =
      "INSERT INTO registers(firstname, lastname, email,gender, password,is_verified_email, verification_code) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *";
    await pool.connect();
    const registerNewUser = await pool.query(sqlQuery2, [
      firstName,
      lastName,
      email,
      gender, // to be removed
      hashedPassword,
      isVerifiedEmail,
      emailVerificationCode,
    ]);
    console.log("Logging Logging Logging"); // to be removed
    //send a verification code to user email   using a function of its own
    if (registerNewUser.rows.length > 0) {
      console.log(registerNewUser.rows[0]);
      const userEmail = registerNewUser.rows[0].email;
      const verificationCode = registerNewUser.rows[0].verification_code;
      const userId = registerNewUser.rows[0].id;
      sendEmailVerificationLink(userEmail, userId, verificationCode);
      res.json(registerNewUser.rows[0]);
      console.log(`Email sent: ${registerNewUser.rows[0].email}`);
    } else {
      res.send({ msg: "Internal server error" });
    }
  }
};

// verify the user entered code
app.post("/verify-user-email/:id", async (req, res) => {
  const { id } = req.params;
  const { verificationCode } = req.body;
  const sqlQuery1 = "SELECT * FROM registers WHERE id = $1";
  await pool.connect;
  const verifyUserEmail = await pool.query(sqlQuery1, [id]);
  if (verifyUserEmail.rows.length > 0) {
    const codeStoredInDatabase = verifyUserEmail.rows[0].verification_code;
    const userEmail = verifyUserEmail.rows[0].email;
    const userId = verifyUserEmail.rows[0].id;
    console.log(`Email being verified exists: ${userEmail}`);
    if (codeStoredInDatabase === verificationCode) {
      // change the verification status
      const sqlQuery2 =
        "UPDATE registers SET is_verified_email = TRUE WHERE id = $1 RETURNING *";
      const changeVerificationStatusToTrue = await pool.query(sqlQuery2, [
        userId,
      ]);
      if (changeVerificationStatusToTrue.rows.length > 0) {
        console.log(`${userEmail} has been verified`);
        res.send({
          verificationStatusMsg: userEmail + " has been fully verified",
        });
      } else {
        console.log(
          `${userEmail}'s verification status has not been changed to true `
        );
        res.send({
          verificationStatusMsg:
            "Internal server error during email verification process",
        });
      }
    } else {
      console.log(``);
      res.send({
        verificationStatusMsg:
          "sorry, an error occurred during email verification process",
      });
    }
  } else {
    res.send({
      verificationStatusMsg:
        "sorry, an error occurred during email verification process",
    });
  }
});

// Login a user
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    await pool.connect();
    const sqlQuery1 = "SELECT * FROM registers WHERE email =$1";
    const response = await pool.query(sqlQuery1, [email]);

    if (response.rows.length > 0) {
      const userEmail = response.rows[0].email;
      const passwordFromDatabase = response.rows[0].password;
      const isVerifiedEmail = response.rows[0].is_verified_email;
      userId = response.rows[0].id;
      if (isVerifiedEmail == true) {
        if (await bcrypt.compare(password, passwordFromDatabase)) {
          // assign token to the user
          assignTokenToUser(res, userId);
        } else {
          res.send({
            loginStatusMsg: "You have entered an incorrect password !",
          });
          console.log("Incorrect password");
        }
      } else {
        res.send({
          loginStatusMsg:
            "This email is partly registered and not yet verified, so go to the email inbox and click the link we sent to complete registration.",
          partlyRegisteredEmail: `${userEmail}`,
        });
        console.log(`Email ${userEmail} is partly registered`);
        // keep this email being sent to the localStorage
      }
    } else {
      res.send({ loginStatusMsg: "User does not exist !" });
      console.log("User does not exist");
    }
  } catch (err) {
    console.log(err);
  }
});

// function to assign a user a token
const assignTokenToUser = (res, userId) => {
  jwt.sign({ userId }, process.env.ACCESS_SECRETE_TOKEN, (err, accessToken) => {
    if (err) {
      res.send({
        Error: err,
        loginStatusMsg: "Error occurred when generating the token",
      });
    } else {
      // give the user the token
      res.send({
        loginStatusMsg: "You have successfully logged in",
        userId,
        accessToken,
      });
      console.log(response.rows[0]);
      console.log(userId);
    }
  });
};

module.exports = app;
