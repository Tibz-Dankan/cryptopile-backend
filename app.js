const express = require("express");
const register = require("./register");
const pile = require("./pile");
const app = express();
const fileuploads = require("./fileupload");
app.use("/", fileuploads);

// Register a new user
app.use("/", register);

// The pile section
app.use("/", pile);

const port = process.env.port || 5000;
app.listen(port, () =>
  console.log(`server started and running on port ${port}...`)
);
