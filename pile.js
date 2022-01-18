const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./dbConfig");
const { verifyToken } = require("./verifyToken");
require("dotenv").config();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// Add new content
app.post("/api/pile/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;
    const { storageDate } = req.body;

    // await pool.connect();
    // Getting user's firstName and id from register table
    const sql1 = "SELECT * FROM accounts WHERE userId = $1";
    const getUserFirstNameAndUserId = await pool.query(sql1, [userId]);
    const user = getUserFirstNameAndUserId.rows;
    const user_id = getUserFirstNameAndUserId.rows[0].userid;
    console.log(user_id); // to be removed
    const user_name = getUserFirstNameAndUserId.rows[0].firstname;
    console.log(user_name); // to be removed
    console.log(user);
    if (user.length > 0) {
      const sql2 =
        "INSERT INTO todo(userId, userName,description, timeOfAdd, dateOfAdd) VALUES($1, $2, $3, $4, $5)  RETURNING *";
      const addNewContent = await pool.query(sql2, [
        user_id,
        user_name,
        description,
        storageDate,
        storageDate,
      ]);
      // await pool.end();
      const response = res.json(addNewContent.rows[0]);
      console.log(response.rows[0]);
    } else {
      // when no user in the database
      res.send({ msg: "user does not exist in the database" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Provide (get) the content
app.get("/api/getpile/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "SELECT * FROM todo WHERE userId = $1 ORDER BY todoId ASC"; // in ascending order
    // await pool.connect();
    const getPile = await pool.query(sql1, [userId]);
    const response = res.json(getPile);
    console.log(response);
    // await pool.end();
  } catch (err) {
    console.log(err);
  }
});

// Edit the content
// Edit the title    //And to be deleted
app.put("/api/edit-pile-title/:pile_id", verifyToken, async (req, res) => {
  const { pile_id } = req.params;
  const { title } = req.body;
  const sql1 = "UPDATE todo SET title = $1 WHERE pile_id = $2";
  // await pool.connect();
  const updatePileTitle = await pool.query(sql1, [title, pile_id]);
  const response = res.json(updatePileTitle);
  console.log(response);
  // await pool.end();
});
// Edit the description
app.put(
  "/api/edit-pile-description/:pile_id",
  verifyToken,
  async (req, res) => {
    const { pile_id } = req.params;
    const { description } = req.body;
    const sql1 = "UPDATE todo SET description = $1 WHERE todoId = $2";
    // await pool.connect();
    const updatePileDescription = await pool.query(sql1, [
      description,
      pile_id,
    ]);
    const response = res.json(updatePileDescription);
    console.log(response);
    // await pool.end();
  }
);

//Delete the content
//Delete  pile title and pile descriptions
app.delete("/api/delete-pile/:pile_id", verifyToken, async (req, res) => {
  try {
    const { pile_id } = req.params;
    const sql1 = "DELETE FROM todo WHERE todoId = $1";
    // await pool.connect();
    const deletePile = await pool.query(sql1, [pile_id]);
    const response = res.json(deletePile);
    console.log(response);
    // await pool.end();
  } catch (error) {
    console.log(error);
  }
});

//Delete all the pile

// Features to be added in the future
// Note the features are not in any order
// Email verification during signup (Mail gun  to send the emails)
//Account recovery incase password forgotten (still Mail gun involved)
// Authentication with Google api, facebook api, And Github api
// All pictures with cloudinary (profile pictures, background pictures and any necessary form of pictures)
// Date and time of creating an account by the user
// cater for te age case when the token is deleted

module.exports = app;
