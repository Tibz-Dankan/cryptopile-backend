const { Pool } = require("pg");
require("dotenv").config();

// //production here
const isProduction = process.env.NODE_ENV === "production"; // Research for know the real meaning for this
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// // new pool object
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
