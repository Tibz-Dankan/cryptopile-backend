const express = require("express");
const pool = require("./../dbConfig");
const { verifyToken } = require("./../verifyToken");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// get user profile
app.get("/get-user-info/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sql1 = "SELECT * FROM accounts WHERE userId = $1";
    const response = await pool.query(sql1, [userId]);
    console.log(response.rows);
    const userIdFromDatabase = response.rows[0].userid;
    const firstName = response.rows[0].firstname;
    const lastName = response.rows[0].lastname;
    const email = response.rows[0].email;
    const isverifiedemail = response.rows[0].isverifiedemail;

    if (response.rows.length > 0) {
      // get the url from the database
      // note that imageUrlOwnerId is the same as UserId
      const sql2 = "SELECT * FROM imageUrl WHERE  imageUrlOwnerId = $1";
      const getImageUrl = await pool.query(sql2, [userId]);
      let imageUrl;
      if (getImageUrl.rows.length == 0) {
        imageUrl = null;
      } else {
        imageUrl = getImageUrl.rows[0].imageurl;
      }

      const userInfoObject = {
        userId: userIdFromDatabase,
        firstName: firstName,
        lastName: lastName,
        email: email,
        isverifiedemail: isverifiedemail,
        imageUrl: imageUrl,
      };
      console.log(userInfoObject);
      const arrayOfUserInfo = [userInfoObject];
      res.send(arrayOfUserInfo);
    }
  } catch (error) {
    console.log(error);
  }
});

// Insert profile image url in the database
app.post("/api/upload-profile-image-url/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;
    const { imageCategory } = req.body;
    // note that userId is the same as imageUrlOwnerId
    // And imageCategory same as imageUrlCategory
    const sql1 =
      "INSERT INTO imageUrl(imageUrlCategory,imageUrlOwnerId,imageUrl) VALUES($1,$2,$3) RETURNING *";
    const response = await pool.query(sql1, [imageCategory, userId, imageUrl]);
    console.log(response.rows);
    if (response.rows.length > 0) {
      res.json(response.rows[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

// Insert  website image url in the database
app.post("/api/upload-website-image-url", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log(`The image url is:  ${imageUrl}`); // for debugging purposes
    const { imageCategory } = req.body;
    // Note that imageCategory same as imageUrlCategory
    const sql1 =
      "INSERT INTO imageUrl(imageUrlCategory,imageUrl) VALUES($1,$2) RETURNING *";
    const response = await pool.query(sql1, [imageCategory, imageUrl]);
    console.log(response.rows);
    if (response.rows.length > 0) {
      res.json(response.rows[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

// Get website image url from the database
app.get("/api/upload-website-image-url/:imageCategory", async (req, res) => {
  try {
    const { imageCategory } = req.params;
    const sql1 = "SELECT * FROM imageUrl WHERE imageUrlCategory = $1";
    const response = await pool.query(sql1, [imageCategory]);
    console.log(response.rows);
    if (response.rows.length == 0) {
      res.send({ imagecategory: null });
    } else {
      res.json(response.rows[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

// edit user profile

module.exports = app;
