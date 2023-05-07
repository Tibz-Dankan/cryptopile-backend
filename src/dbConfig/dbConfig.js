require("dotenv").config();
const pg = require("pg");

const db = new pg.Client({
  connectionString: process.env.POSTGRES_URL,
});

db.connect((err) => {
  if (err) {
    console.log(err, "Failed to connect to the database");
  } else {
    console.log("Database successfully connected!");
  }
});

module.exports = db;
