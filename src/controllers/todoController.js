const Todo = require("../models/todo");
const User = require("../models/user");
const { encrypt, decrypt } = require("../utils/crypto");

const createUserTodo = async (req, res) => {
  const { userId } = req.params;
  const { description } = req.body;
  const { dateOfAdd } = req.body;
  const { timeOfAdd } = req.body;
  const encryptTodo = encrypt(description);
  const encryptedTodoDescription = encryptTodo.content;
  const iv = encryptTodo.iv;

  //   get user firstName
  const userInfo = await User.getUserById(userId);
  if (userInfo.rows.length > 0) {
    userFirstName = userInfo.rows[0].firstname;

    const insertTodoInDatabase = await Todo.createTodo(
      userId,
      userFirstName,
      encryptedTodoDescription,
      iv,
      dateOfAdd,
      timeOfAdd
    );
    if (insertTodoInDatabase.rows[0]) {
      res.status(200).json({
        status: "success",
      });
    }
    console.log("Todo added successfully");
  }
};

const getAllUserTodos = async (req, res) => {
  const { userId } = req.params;
  const getUserTodos = await Todo.getTodos(userId);
  const encryptedTodos = getUserTodos.rows;
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
};

const updateUserTodo = async (req, res) => {
  const { todoId } = req.params;
  const { description } = req.body;
  const { dateOfUpdate } = req.body;
  const { timeOfUpdate } = req.body;
  const encryptTodo = encrypt(description);
  const encryptedTodoDescription = encryptTodo.content;
  const iv = encryptTodo.iv;

  const updateTodoDescription = await Todo.updateTodo(
    todoId,
    dateOfUpdate,
    timeOfUpdate,
    encryptedTodoDescription,
    iv
  );
  const response = res.json(updateTodoDescription);
  console.log(response.rows); //to be changed
};

const markTodoComplete = async (req, res) => {
  const { todoId } = req.params;
  const { todoMarkedComplete } = req.body;

  const markTodo = await Todo.updateTodoAsComplete(todoId, todoMarkedComplete);
  const response = res.json(markTodo);
  console.log(response);
};

const deleteUserTodo = async (req, res) => {
  const { todoId } = req.params;
  const deleteUserTodo = await Todo.deleteTodo(todoId);
  const response = res.json(deleteUserTodo);
  console.log("Todo deleted" + response.rows);
};

module.exports = {
  createUserTodo,
  getAllUserTodos,
  updateUserTodo,
  markTodoComplete,
  deleteUserTodo,
};
