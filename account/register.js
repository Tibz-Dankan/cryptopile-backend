const express = require("express");
const pool = require("./../dbConfig");
const { sendEmailVerificationLink } = require("./sendVerificationEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const emailExistence = require("email-existence");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

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

module.exports = app;
