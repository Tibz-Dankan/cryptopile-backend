const express = require("express");
const app = express();

const fileupload = require("express-fileupload");
app.use(fileupload());

// app.post("/uploads", (req, res) => {
//   if (req.files === null) {
//     return status(400).json({ msg: "No file is chosen" });
//   }
//   const file = req.files.file;
//   // move the file any where it to be using mv() method // checkout the code on github for more information
//   file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
//     if (err) {
//       console.error(err);
//       return status(500).send(err);
//     }
//     res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
//   });
// });

// To use a get request to fetch data  from the database and we will fetch this to the frontend in react
// well start by just hard coding the members that are suppossed to be in the database and remember any
// can changed to suite the goal of the this app

// post reqest about fileuploads wi always be here
module.exports = app;
