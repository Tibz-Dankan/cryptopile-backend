require("dotenv").config();

// HEROKU PSQL DB CONFIGURATIONS
// const { Pool } = require("pg");
// //production here
// const isProduction = process.env.NODE_ENV === "production";
// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
// // // new pool object
// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//   // ssl: {
//   //   rejectUnauthorized: false,
//   // },
// });

// MICROSOFT AZURE PSQL CONFIGURATIONS
const pg = require("pg");

const config = {
  host: process.env.DB_HOST, //"<your-db-server-name>.postgres.database.azure.com",
  user: process.env.DB_USER, // "<your-db-username>",
  password: process.env.DB_PASSWORD, // "<your-password>",
  database: process.env.DB_DATABASE, //"<name-of-database>",
  port: process.env.DB_PORT,
  // ssl: true,
};

const pool = new pg.Client(config);
pool.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Database successfully connected!");
  }
});

module.exports = pool;
