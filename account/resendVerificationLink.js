const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./../dbConfig");
const { randomNumber } = require("./../generateRandomNumber");
const { sendEmailVerificationLink } = require("./sendVerificationEmail");
require("dotenv").config();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

app.post("/resend-verification-link", async (req, res) => {
  try {
    const { partlyRegisteredEmail } = req.body;
    const sqlQuery = "SELECT * FROM accounts WHERE email = $1";
    // await pool.connect();
    const response = await pool.query(sqlQuery, [partlyRegisteredEmail]);
    if (response.rows.length > 0) {
      const userEmail = response.rows[0].email;
      const userId = response.rows[0].userid;
      const verificationCode = randomNumber();
      const sqlQuery2 =
        "UPDATE accounts SET verificationCode = $1 WHERE userId = $2 RETURNING *";
      const updateVerificationCode = await pool.query(sqlQuery2, [
        verificationCode,
        userId,
      ]);
      if (updateVerificationCode.rows.length > 0) {
        sendEmailVerificationLink(userEmail, userId, verificationCode);
        console.log(
          `Email resent to ${userEmail} with code ${verificationCode}`
        );
        res.send({
          verificationLinkStatus: "verification email sent successfully !",
        });
        // await pool.end();
      } else {
        console.log("Failed to update the verification code ! in the database");
        res.send({
          verificationLinkStatus: "Internal server error occurred !",
        });
      }
    } else {
      res.send({ verificationLinkStatus: "An error occurred email not sent" });
    }
    // await pool.end();
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
