const express = require("express");
const pool = require("./../dbConfig");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

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
          code: codeStoredInDatabase,
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
      console.log("Failed to match the client and server codes !");
      res.send({
        verificationStatusMsg:
          "Sorry, an error occurred during email verification process",
      });
    }
  } else {
    console.log("The user altered the verification link");
    res.send({
      verificationStatusMsg:
        "Sorry, an error occurred during email verification process",
    });
  }
});

module.exports = app;
