const User = require("../models/user");
const Admin = require("../models/admin");
const Todo = require("../models/todo");

const adminGetUsers = async (req, res) => {
  const response = await User.getAllUsers();
  res.json(response.rows);
  console.log("Admin has gotten users");
};

const getAdminProfile = async (req, res) => {
  const response = await Admin.getAdmin();
  res.json(response);
  console.log("Getting admin profile");
};

const adminVerifyUser = async (req, res) => {
  const { userId } = req.params;
  // const { firstName } = req.body;
  const response = await User.verifyUser(userId);
  console.log(
    ` user with id ${response.rows[0].userid} is verified by the admin`
  );
  res.json(response);
};

const adminDeleteUser = async (req, res) => {
  const { userId } = req.params;
  const deleteAllUserTodos = await Todo.deleteAllTodos(userId);
  if (deleteAllUserTodos) {
    const deleteUser = await User.deleteUser(userId);
    console.log("Admin has deleted a user");
    res.json(deleteUser);
  }
};

module.exports = {
  adminGetUsers,
  getAdminProfile,
  adminVerifyUser,
  adminDeleteUser,
};
