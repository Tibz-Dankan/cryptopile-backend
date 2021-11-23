const express = require("express");
const pool = require("./dbConfig");
const { sendVerificationEmail } = require("./verifyEmail");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "https://cryptopile.netlify.app" }));
// app.use(cors());

// get username for the profile and send to the frontend
app.get("/api/getusername/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "SELECT firstname, lastname  FROM registers WHERE id = $1";
    await pool.connect();
    const response = await pool.query(sql1, [userId]);
    const sendUserName = res.json(response.rows[0]);
    console.log(sendUserName);
  } catch (error) {
    console.log(error);
  }
});

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { firstname } = req.body;
    const { lastname } = req.body;
    var { email } = req.body;
    const { gender } = req.body;
    const { password } = req.body;
    const { confirm_password } = req.body;
    const { is_verified_email } = req.body;
    const emailVerificationCode = Math.floor(Math.random() * 1000000);

    // Ensure that password and confirm password are the same
    if (password != confirm_password) {
      res.send({ msgPassword: "Passwords don't match !" });
    } else {
      // check whether the email exists
      const sql = "SELECT * FROM registers WHERE email = $1";
      const checkEmailExistance = await pool.query(sql, [email]);
      if (checkEmailExistance.rows.length > 0) {
        res.send({ msgEmail: "Email Aldready Exists ! " });
      } else {
        // Store the user details into the database
        const hashedPassword = await bcrypt.hash(password, 10); // hashing password
        const sql2 =
          "INSERT INTO registers(firstname, lastname, email,gender, password,is_verified_email, verification_code) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *";
        await pool.connect();
        const registerNewUser = await pool.query(sql2, [
          firstname,
          lastname,
          email,
          gender,
          hashedPassword,
          is_verified_email,
          emailVerificationCode,
        ]);
        console.log("Logging");
        console.log("Logging");
        console.log("Logging");
        //send a verification code to user email
        // if (registerNewUser.statusCode === 200) {
        if (registerNewUser.rows.length > 0) {
          console.log(registerNewUser.rows[0]);
          //  a problem with above line of code (the condition)
          const userEmail = registerNewUser.rows[0].email;
          const verificationCode = registerNewUser.rows[0].verification_code;
          // send response to the user
          const response = res.json(registerNewUser.rows[0]); //maybe removed
          // function to send an email to the user
          sendVerificationEmail(userEmail, verificationCode);
          console.log(response); //maybe removed
        } else {
          res.send({ msg: "Internal server error" });
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// verify the user entered code
app.post("/verify-user-email", async (req, res) => {
  const { verificationCode } = req.body;
  const sql1 = "SELECT * FROM registers WHERE verification_code = $1";
  await pool.connect;
  const verifyUserEmail = await pool.query(sql1, [verificationCode]);
  const storedCode = verifyUserEmail.rows[0].verification_code;
  const userEmail = verifyUserEmail.rows[0].email;
  //match the two codes
  if (storedCode === verificationCode) {
    res.send({ verificationMsg: `${userEmail} has been fully verified` });
  } else {
    res.send({ verificationMsg: "You have entered an incorrect code !" });
  }
});

// Login a user
app.post("#/login", async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const sql1 = "SELECT * FROM registers WHERE email =$1";
    await pool.connect();
    const response = await pool.query(sql1, [email]);

    if (response.rows.length > 0) {
      // we have to authenticate the user
      if (await bcrypt.compare(password, response.rows[0].password)) {
        userId = response.rows[0].id;
        // Assign the user the token to be used when making other request on the website
        jwt.sign(
          { userId },
          process.env.ACCESS_SECRETE_TOKEN,
          (err, accessToken) => {
            if (err) {
              res.send({ Error: err, msg: "Error in generating the token" });
            } else {
              // give the user the token
              res.send({
                success: "You have successfully logged in",
                userId,
                accessToken,
              });
              console.log(response.rows[0]);
              console.log(userId);
            }
          }
        );
      } else {
        res.send({ msg: "You have entered an incorrect password !" });
      }
    } else {
      res.send({ msg: "User doesnot exist !" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
