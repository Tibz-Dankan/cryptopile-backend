const express = require("express");
const pool = require("./../dbConfig");
const { verifyToken } = require("./../verifyToken");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// get admin profile
app.get("/get-user-info/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "SELECT * FROM accounts WHERE userId = $1";
    const response = await pool.query(sql1, [userId]);
    console.log(response.rows);
    res.json(response.rows);
  } catch (error) {
    console.log(error);
  }
});

// edit user profile

module.exports = app;
