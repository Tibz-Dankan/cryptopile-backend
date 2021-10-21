const express = require("express");
const pool = require("./dbConfig");
// const verifyEmail = require("./verifyEmail");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
app.use(express.json());
// app.use(cors({ origin: "https://stockpile-frontend.netlify.app" }));
app.use(cors());

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

    // Ensure that password and confirm password are the same
    if (password != confirm_password) {
      res.send({ msgPassword: "Passwords don't match !" });
    } else {
      // check whether the email exists
      const sql = "SELECT * FROM registers WHERE email = $1";
      const emailCheckExistance = await pool.query(sql, [email]);
      if (emailCheckExistance.rows.length > 0) {
        res.send({ msgEmail: "Email Aldready Exists ! " });
      } else {
        // Store the user details into the database
        const hashedPassword = await bcrypt.hash(password, 10); // hashing password
        const sql2 =
          "INSERT INTO registers(firstname, lastname, email,gender, password,is_verified_email) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
        await pool.connect();
        const registerNewUser = await pool.query(sql2, [
          firstname,
          lastname,
          email,
          gender,
          hashedPassword,
          is_verified_email,
        ]);
        const response = res.json(registerNewUser.rows[0]);
        console.log(response);

        //verify the user email
        if (response.statusCode === 200) {
          //code to verify the user email
          // app.use("/", verifyEmail);
        } else {
          //something went wrong  maybe user details not stored in the database
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// Login a user
app.post("/login", async (req, res) => {
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
