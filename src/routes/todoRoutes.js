const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  createUserTodo,
  getAllUserTodos,
  updateUserTodo,
  markTodoComplete,
  deleteUserTodo,
} = require("../controllers/todoController");

const router = express.Router();
router.post("/api/todo/:userId", verifyToken, createUserTodo);
router.get("/api/get-todos/:userId", verifyToken, getAllUserTodos);
router.put("/api/edit-todo-description/:todoId", verifyToken, updateUserTodo);
router.put("/api/mark-todo-complete/:todoId", verifyToken, markTodoComplete);
router.delete("/api/delete-todo/:todoId", verifyToken, deleteUserTodo);

module.exports = router;
