const express = require("express");
const pool = require("./../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const sqlQuery1 = "SELECT * FROM accounts WHERE email =$1";
    const response = await pool.query(sqlQuery1, [email]);

    if (response.rows.length > 0) {
      const userEmail = response.rows[0].email;
      const passwordFromDatabase = response.rows[0].password;
      const isVerifiedEmail = response.rows[0].isverifiedemail;
      userId = response.rows[0].userid;

      if (isVerifiedEmail == true) {
        if (await bcrypt.compare(password, passwordFromDatabase)) {
          // assign token to the user
          assignTokenToUser(res, userId);
        } else {
          res.send({
            loginStatusMsg: "You have entered an incorrect password !",
          });
          console.log("Incorrect password");
          // await pool.end();
        }
      } else {
        res.send({
          loginStatusMsg:
            "This email is partly registered and not yet verified, so go to the email inbox and confirm the email we sent to complete registration.",
          partlyRegisteredEmail: `${userEmail}`,
        });
        console.log(`Email ${userEmail} is partly registered`);
        // keep this email being sent to the localStorage
        // await pool.end();
      }
    } else {
      res.send({ loginStatusMsg: "User does not exist !" });
      console.log("User does not exist");
      // await pool.end();
    }
  } catch (err) {
    console.log(err);
  }
});

// function to assign a user a token
const assignTokenToUser = (res, userId) => {
  jwt.sign(
    { userId },
    process.env.ACCESS_SECRETE_TOKEN,
    async (err, accessToken) => {
      if (err) {
        res.send({
          Error: err,
          loginStatusMsg: "Error occurred when generating the token",
        });
        // await pool.end();
      } else {
        // give the user the token
        res.send({
          loginStatusMsg: "You have successfully logged in",
          userId,
          accessToken,
        });
        console.log(userId);
        // await pool.end();
      }
    }
  );
};

module.exports = app;
