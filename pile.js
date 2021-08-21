const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./dbConfig");
const { verifyToken } = require("./verifyToken");
require("dotenv").config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//https://stockpile-frontend.netlify.app/
// app.use(cors({ origin: "https://stockpile-frontend.netlify.app" }));
app.use(cors());
//Trial
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// Add new content

app.post("/api/pile/:userId", verifyToken, async (req, res) => {
  try {
    //the id params
    const { userId } = req.params; // to be used ti get the user
    const { title } = req.body;
    const { description } = req.body;
    //date and time
    const date = new Date();
    // date
    //  const dates = date.getDate()   // gives the day of the month
    //  const month = date.getMonth()   // gives the month
    //  const year = date.getFullYear()      //gives the year
    //  const current_date =`${year}-${month}-${dates}`
    // // time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const current_time = `${hours}:${minutes}:${seconds}`;
    // query to get the username and user_id from the register table

    await pool.connect();
    // first get user firstname and id from register table
    const sql1 = "SELECT * FROM test WHERE id = $1";
    const getUserFirstnameAndUserId = await pool.query(sql1, [userId]);
    const user = getUserFirstnameAndUserId.rows;
    const user_id = getUserFirstnameAndUserId.rows[0].id;
    const user_name = getUserFirstnameAndUserId.rows[0].firstname;
    console.log(user);
    if (user.length > 0) {
      const sql2 =
        "INSERT INTO pile(title, description, user_id, user_name, date_of_add, time_of_add) VALUES($1, $2, $3, $4, $5, $6)  RETURNING *";
      const addNewContent = await pool.query(sql2, [
        title,
        description,
        user_id,
        user_name,
        date,
        current_time,
      ]);
      const response = await res.json(addNewContent.rows[0]);
      console.log(response);
    } else {
      // wen mo user in the database
      res.send({ msg: "user does not exist in the database" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Provide (get) the content
app.get(`/api/getpile/:userId`, verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "SELECT * FROM pile WHERE user_id = $1";
    await pool.connect();
    const getPile = await pool.query(sql1, [userId]);
    const response = res.json(getPile);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
});

// Edit the content

//Delete the content
app.delete("/api/deletepile/:pile_id", verifyToken, async (res, req) => {
  try {
    const { pile_id } = req.params;
    const sql1 = "DELETE * FROM pile WHERE pile_id = $1";
    const deletePile = await query(sql1, [pile_id]);
    const response = res.json(deletePile);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
