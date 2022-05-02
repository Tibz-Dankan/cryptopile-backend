const db = require("../dbConfig/dbConfig");

const Admin = {};

Admin.getAdmin = () => {
  db.query("SELECT * FROM admin");
};

module.exports = Admin;
