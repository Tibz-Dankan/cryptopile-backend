const express = require("express");
const register = require("./register");
const pile = require("./pile");
const app = express();
const fileuploads = require("./fileupload");
const theSecretes = require("./theSecretes");

app.use("/", fileuploads);
// Register a new user
app.use("/", register);

// The pile section
app.use("/", pile);

// The user secretes
app.use("/", theSecretes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);
