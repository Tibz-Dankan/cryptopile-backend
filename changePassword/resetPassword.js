const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const pool = require("./../dbConfig");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// sending verification code to user email
app.post("/reset-password/:userId", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const { newPassword } = req.body;
    const { userId } = req.params;
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const sqlQuery =
      "UPDATE registers SET password = $1 WHERE id = $2 AND email =$3 RETURNING *";
    await pool.connect();
    const response = await pool.query(sqlQuery, [
      newHashedPassword,
      userId,
      userEmail,
    ]);
    if (response.rows.length > 0) {
      console.log("Password reset to: " + response.rows[0].password);
      res.send({ passwordResetMsg: "password-reset-successful" });
    } else {
      res.send({ passwordResetMsg: "Can not reset password" });
    }
  } catch (error) {
    console.log(error);
  }
});
// also check if changed if the password has changed from the one being stored in the database
// and if yes proceed and changed if not, should not be changed
module.exports = app;
