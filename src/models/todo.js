const db = require("../dbConfig/dbConfig");

const Todo = {};

// Add todo
Todo.createTodo = (
  userId,
  userFirstName,
  encryptedTodoDescription,
  iv,
  dateOfAdd,
  timeOfAdd
) => {
  return db.query(
    "INSERT INTO todo(userId, userName, description, iv, timeOfAdd, dateOfAdd) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
    [userId, userFirstName, encryptedTodoDescription, iv, timeOfAdd, dateOfAdd]
  );
};

// Get todos
Todo.getTodos = (userId) => {
  return db.query("SELECT * FROM todo WHERE userId = $1 ORDER BY todoId ASC", [
    userId,
  ]);
};

// Update(edit) todo
Todo.updateTodo = (
  todoId,
  dateOfUpdate,
  timeOfUpdate,
  encryptedTodoDescription,
  iv
) => {
  return db.query(
    "UPDATE todo SET description = $1, iv = $2, timeOfAdd= $3, dateOfAdd = $4 WHERE todoId = $5",
    [encryptedTodoDescription, iv, timeOfUpdate, dateOfUpdate, todoId]
  );
};

// Mark todo as complete
Todo.updateTodoAsComplete = (todoId, todoMarkedComplete) => {
  return db.query(
    "UPDATE todo SET todoMarkedComplete = $1 WHERE todoId = $2 RETURNING todoMarkedComplete",
    [todoMarkedComplete, todoId]
  );
};

// Delete a todo
Todo.deleteTodo = (todoId) => {
  return db.query("DELETE FROM todo WHERE todoId = $1", [todoId]);
};

// Delete all todos corresponding to a given userId
Todo.deleteAllTodos = (userId) => {
  return db.query("DELETE FROM todo WHERE userId = $1", [userId]);
};

module.exports = Todo;
