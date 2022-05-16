require("dotenv").config();
const pg = require("pg");
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

let credentialObject;

const credentialObjForLocalDev = {
  connectionString: connectionString,
};

const credentialObjForProd = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

if (isProduction) {
  credentialObject = credentialObjForProd;
} else {
  credentialObject = credentialObjForLocalDev;
}

const db = new pg.Client(credentialObject);
db.connect((err) => {
  if (err) {
    console.log("Error:Failed to connect to the database");
  } else {
    console.log("Database successfully connected!");
  }
});

module.exports = db;
