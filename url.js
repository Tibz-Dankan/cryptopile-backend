const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const localUrl = app.use(cors());
const productionUrl = app.use(
  cors({ origin: "https://cryptopile.netlify.app" })
);
// const productionUrl = app.use(cors({ origin: process.env.PRODUCTION_URL }));

module.exports = { localUrl, productionUrl };
