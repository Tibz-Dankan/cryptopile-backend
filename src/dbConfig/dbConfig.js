require("dotenv").config();

const mysql = require("mysql2/promise");

const connectionString = process.env.DATABASE_URL;

// // create the connection to database
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "test",
// });

const dbConnection = mysql.createConnection(connectionString);
console.log("connected to mysql database 🪁");

// // simple query
// connection.query(
//   'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
//   function (err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

// // with placeholder
// connection.query(
//   "SELECT * FROM `table` WHERE `name` = ? AND `age` > ?",
//   ["Page", 45],
//   function (err, results) {
//     console.log(results);
//   }
// );

module.exports = { dbConnection };

// How to connect to mysql via shell
// 1. \sql
// 2. \connect root@localhost and provide your password
