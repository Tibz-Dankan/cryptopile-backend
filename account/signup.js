const express = require("express");
const pool = require("./../dbConfig");
const { sendEmailVerificationLink } = require("./sendVerificationEmail");
const bcrypt = require("bcrypt");
const cors = require("cors");
const emailExistence = require("email-existence");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// Register a new user
app.post("/signup", async (req, res) => {
  try {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { isVerifiedEmail } = req.body;
    const emailVerificationCode = Math.floor(Math.random() * 1000000);

    emailExistence.check(email, (error, response) => {
      if (error) {
        res.send({
          emailValidationMsg:
            "Sorry, an error occurred during process of validating your email",
        });
        console.log(error);
      } else {
        if (response) {
          registerNewUserDetails(
            firstName,
            lastName,
            email,
            password,
            isVerifiedEmail,
            emailVerificationCode,
            res
          );
          console.log("Email validity is :" + response);
        } else {
          res.send({
            emailValidationMsg:
              "It looks like this email does not exists or it is invalid !",
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
});

//  function  to signup new user here
const registerNewUserDetails = async (
  firstName,
  lastName,
  email,
  password,
  isVerifiedEmail,
  emailVerificationCode,
  res
) => {
  //  store user and send verification link to his/her email
  const sqlQuery = "SELECT * FROM accounts WHERE email = $1";
  // await pool.connect();
  const checkEmailInDatabase = await pool.query(sqlQuery, [email]);
  console.log(checkEmailInDatabase.rows);

  if (checkEmailInDatabase.rows.length > 0) {
    res.send({ emailValidationMsg: "This email already registered !" });
    // await pool.end();
  } else {
    // Store the user details into the database
    const hashedPassword = await bcrypt.hash(password, 10); // hashing password
    const sqlQuery2 =
      "INSERT INTO accounts(firstName, lastName, email, password, isVerifiedEmail, verificationCode) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
    const registerNewUser = await pool.query(sqlQuery2, [
      firstName,
      lastName,
      email,
      hashedPassword,
      isVerifiedEmail,
      emailVerificationCode,
    ]);

    if (registerNewUser.rows.length > 0) {
      console.log(registerNewUser.rows[0]);
      const userEmail = registerNewUser.rows[0].email;
      const verificationCode = registerNewUser.rows[0].verificationcode;
      const userId = registerNewUser.rows[0].userid;
      sendEmailVerificationLink(userEmail, userId, verificationCode);
      res.json(registerNewUser.rows[0]);
      console.log(`Email sent: ${registerNewUser.rows[0].email}`);
      console.log(`userId sent: ${registerNewUser.rows[0].userid}`);
      console.log(`code sent: ${registerNewUser.rows[0].verificationcode}`);
      // await pool.end();
    } else {
      console.log("user signup failed !");
      res.send({ msg: "Internal server error" });
      // await pool.end();
    }
  }
};

module.exports = app;
