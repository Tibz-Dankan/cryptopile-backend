const express = require("express");
const pool = require("./../dbConfig");
const { verifyToken } = require("./../verifyToken");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// login admin from here
//

// get user accounts
app.get("/get-user-accounts", verifyToken, async (req, res) => {
  try {
    const sql1 = "SELECT * FROM accounts ORDER BY userId ASC";
    const response = await pool.query(sql1);
    console.log(response.rows);
    res.json(response.rows);
  } catch (error) {
    console.log(error);
  }
});

// get admin profile
app.get("/get-admin-profile", verifyToken, async (req, res) => {
  try {
    const sql1 = "SELECT * FROM admin";
    const response = await pool.query(sql1);
    console.log(response.rows);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
// admin verify user
app.put("/admin-verify-user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName } = req.body;
    const sql1 =
      "UPDATE accounts SET isVerifiedEmail = true WHERE userId = $1 AND firstName = $2 RETURNING *";
    const response = await pool.query(sql1, [userId, firstName]);
    console.log(
      ` user with id ${response.rows[0].userid} is verified by the admin`
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// admin delete  user
app.put("/admin-delete-user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "DELETE FROM accounts WHERE userId = $1";
    const response = await pool.query(sql1, [userId]);
    console.log("Admin has deleted a user");
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// // function to assign a user a token
// const assignTokenToUser = (res, userId) => {
//   jwt.sign(
//     { userId },
//     process.env.ACCESS_SECRETE_TOKEN,
//     async (err, accessToken) => {
//       if (err) {
//         res.send({
//           Error: err,
//           loginStatusMsg: "Error occurred when generating the token",
//         });
//         // await pool.end();
//       } else {
//         // give the user the token
//         res.send({
//           loginStatusMsg: "You have successfully logged in",
//           userId,
//           accessToken,
//         });
//         console.log(response.rows[0]);
//         console.log(userId);
//         // await pool.end();
//       }
//     }
//   );
// };

module.exports = app;
