const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./dbConfig");
const { randomNumber } = require("./generateRandomNumber");
const { sendEmailVerificationLink } = require("./sendVerificationEmail");
require("dotenv").config();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

app.post("/resend-verification-link", async (req, res) => {
  try {
    const { partlyRegisteredEmail } = req.body;
    const sqlQuery = "SELECT * FROM registers WHERE email = $1";
    const response = await pool.query(sqlQuery, [partlyRegisteredEmail]);
    if (response.rows.length > 0) {
      const userEmail = response.rows[0].email;
      const userId = response.rows[0].id;
      const verificationCode = randomNumber();
      sendEmailVerificationLink(userEmail, userId, verificationCode);
      console.log(`Email resent to ${userEmail} with code ${verificationCode}`);
      res.send({
        verificationLinkStatus: "verification link sent successfully !",
      });
    } else {
      res.send({ verificationLinkStatus: "An error occurred email not sent" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
