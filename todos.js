const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./dbConfig");
const { verifyToken } = require("./verifyToken");
const { encrypt, decrypt } = require("./crypto");
require("dotenv").config();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// Add todo description
app.post("/api/todo/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;
    const { dateOfAdd } = req.body;
    const { timeOfAdd } = req.body;
    const encryptTodoDescription = encrypt(description); //encrypting todo description
    const encryptedTodoDescription = encryptTodoDescription.content; //encrypted todo description
    const iv = encryptTodoDescription.iv; // initialization vector (iv)

    // Getting user's firstname and id from accounts table
    const sql1 = "SELECT * FROM accounts WHERE userId = $1";
    const getUserAccount = await pool.query(sql1, [userId]);
    const userAccount = getUserAccount.rows;
    const userAccountId = getUserAccount.rows[0].userid;
    const userAccountFirstName = getUserAccount.rows[0].firstname;
    console.log(userAccount);
    if (userAccount.length > 0) {
      const sql2 =
        "INSERT INTO todo(userId, userName, description, iv, timeOfAdd, dateOfAdd) VALUES($1, $2, $3, $4, $5, $6)  RETURNING *";
      const insertTodoInDatabase = await pool.query(sql2, [
        userAccountId,
        userAccountFirstName,
        encryptedTodoDescription,
        iv,
        timeOfAdd,
        dateOfAdd,
      ]);
      // await pool.end();
      const response = res.json(insertTodoInDatabase.rows[0]);
    } else {
      // when no user in the database
      res.send({ msg: "user does not exist in the database" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Provide (get) the content
app.get("/api/get-todos/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "SELECT * FROM todo WHERE userId = $1 ORDER BY todoId ASC";
    const getTodos = await pool.query(sql1, [userId]);
    const encryptedTodos = getTodos.rows;
    console.log(encryptedTodos);

    const decryptedTodos = [];

    encryptedTodos.forEach(
      ({
        todoid,
        userid,
        description,
        iv,
        timeofadd,
        dateofadd,
        todomarkedcomplete,
      }) => {
        //  decrypting todo description
        const decryptedDescription = decrypt({
          iv: `${iv}`,
          content: `${description}`,
        });
        // object containing todo details
        const todoObject = {
          todoid: todoid,
          userid: userid,
          description: decryptedDescription,
          timeofadd: timeofadd,
          dateofadd: dateofadd,
          todomarkedcomplete: todomarkedcomplete,
        };
        decryptedTodos.push(todoObject);
      }
    );
    // send todos to the client
    res.send(decryptedTodos);
  } catch (err) {
    console.log(err);
  }
});

// Edit todo description
app.put("/api/edit-todo-description/:todoId", verifyToken, async (req, res) => {
  const { todoId } = req.params;
  const { description } = req.body;
  const { dateOfUpdate } = req.body;
  const { timeOfUpdate } = req.body;
  const encryptTodoDescription = encrypt(description);
  const encryptedTodoDescription = encryptTodoDescription.content;
  const iv = encryptTodoDescription.iv;

  const sql1 =
    "UPDATE todo SET description = $1, iv = $2, timeOfAdd= $3, dateOfAdd = $4 WHERE todoId = $5";
  const updatePileDescription = await pool.query(sql1, [
    encryptedTodoDescription,
    iv,
    timeOfUpdate,
    dateOfUpdate,
    todoId,
  ]);
  const response = res.json(updatePileDescription);
  console.log(response.rows);
});

// Mark todo as complete
app.put("/api/mark-todo-complete/:todoId", verifyToken, async (req, res) => {
  const { todoId } = req.params;
  const { todoMarkedComplete } = req.body;

  const sql1 =
    "UPDATE todo SET todoMarkedComplete = $1 WHERE todoId = $2 RETURNING todoMarkedComplete";
  const updatePileDescription = await pool.query(sql1, [
    todoMarkedComplete,
    todoId,
  ]);
  const response = res.json(updatePileDescription);
  console.log(response.rows);
});

//Delete todo description
app.delete("/api/delete-todo/:todoId", verifyToken, async (req, res) => {
  try {
    const { todoId } = req.params;
    const sql1 = "DELETE FROM todo WHERE todoId = $1";
    const deletePile = await pool.query(sql1, [todoId]);
    const response = res.json(deletePile);
    console.log(response);
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
// cater for te edge case when the token is deleted

module.exports = app;
