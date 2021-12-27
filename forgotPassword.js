const express = require("express");
const pool = require("./dbConfig");
const cors = require("cors");
const { randomNumber } = require("./generateRandomNumber");
const { sendPasswordResetCode } = require("./sendPasswordResetCode");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// sending verification code to user email
app.post("/forgot-password", async (req, res) => {
  try {
    const { userEmail } = req.body;
    passwordResetCode = randomNumber();
    const sqlQuery = "SELECT * FROM registers WHERE email =$1";
    await pool.connect();
    const response = await pool.query(sqlQuery, [userEmail]);
    if (response.rows.length > 0) {
      const userId = response.rows[0].id;
      const sqlQuery2 =
        "UPDATE registers SET verification_code = $1 WHERE id = $2 RETURNING *";
      const updateCodeStoredInDatabase = await pool.query(sqlQuery2, [
        passwordResetCode,
        userId,
      ]);
      if (updateCodeStoredInDatabase.rows.length > 0) {
        const userEmail = response.rows[0].email;
        sendPasswordResetCode(userEmail, passwordResetCode);
        res.send(updateCodeStoredInDatabase.rows[0]);
        console.log(`sending to email:${userEmail} code: ${passwordResetCode}`);
      } else {
        res.send({
          forgotPasswordMsg:
            "Sending password reset code failed, you can  resend ",
        });
        console.log("Failed to update code in te database!");
      }
    } else {
      res.send({
        forgotPasswordMsg:
          "This email is not registered with us, so can not reset password",
      });
      console.log(`Unregistered email trying to reset password `);
    }
  } catch (error) {
    console.log(error);
  }
});

//resending password reset code
app.post("/resend-password-reset-code", async (req, res) => {
  try {
    const { userId } = req.body;
    const { userEmail } = req.body;
    passwordResetCode = randomNumber();
    const sqlQuery = "SELECT * FROM registers WHERE id =$1 AND email =$2";
    await pool.connect();
    const response = await pool.query(sqlQuery, [userId, userEmail]);
    if (response.rows.length > 0) {
      const userId = response.rows[0].id;
      const sqlQuery2 =
        "UPDATE registers SET verification_code = $1 WHERE id = $2 RETURNING *";
      const updateCodeStoredInDatabase = await pool.query(sqlQuery2, [
        passwordResetCode,
        userId,
      ]);
      if (updateCodeStoredInDatabase.rows.length > 0) {
        const userEmail = response.rows[0].email;
        sendPasswordResetCode(userEmail, passwordResetCode);
        res.send(updateCodeStoredInDatabase.rows[0]);
        console.log(`sending to email:${userEmail} code: ${passwordResetCode}`);
      } else {
        res.send({
          passwordResendCodeMsg:
            "Sending password reset code failed, you can  resend ",
        });
        console.log("Failed to update code in te database!");
      }
    } else {
      res.send({
        passwordResendCodeMsg:
          "This email is not registered with us, so can not reset password",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
