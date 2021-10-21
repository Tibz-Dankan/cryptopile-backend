const express = require("express");
const cors = require("cors");
const pool = require("./dbConfig");
const { verifyToken } = require("./verifyToken");
const { encrypt, decrypt } = require("./crypto");

const app = express();
app.use(express.json());
app.use(cors());
//app.use(cors({origin:"https://stockpile-frontend.netlify.app"}));

// keep the secretes in the database
app.post("/api/secretepile/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { secrete_title } = req.body;
    const { secrete_description } = req.body;
    // get the username and user's registration
    const sql1 = "SELECT firstname, id FROM registers WHERE id = $1";
    const getUsernameAndId = await pool.query(sql1, [userId]);
    //respond with  a json
    // const response = res.json(getUsernameAndId.rows[0]); // to be removed
    console.log(getUsernameAndId.rows[0]);

    const username = getUsernameAndId.rows[0].firstname;
    const registrationId = getUsernameAndId.rows[0].id;
    // tessting using the console
    console.log(username);
    console.log(registrationId);
    // after getting username and id then keep the secretes
    if (getUsernameAndId.rows.length > 0) {
      // Encrypt from here all the user data
      const encryptTitle = encrypt(secrete_title);
      const encryptSecreteTitle = encryptTitle.content; // to be stored in the db
      // iv for the title
      const iv = encryptTitle.iv; // and should be stored in the database
      const encryptDescription = encrypt(secrete_description);
      // for the description
      const encryptSecreteDescription = encryptDescription.content; // to be stored in the db

      const sql2 =
        "INSERT  INTO  secretes (user_id, user_name, secrete_title, secrete_description, iv) VALUES($1, $2, $3, $4, $5) RETURNING *";
      const storeSecretes = await pool.query(sql2, [
        registrationId,
        username,
        encryptSecreteTitle,
        encryptSecreteDescription,
        iv,
      ]);
      const results = res.json(storeSecretes.rows[0]);
      console.log(results);
      console.log(storeSecretes);
    } else {
      res.send({ msg: "some thing went wrong !!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

// get the user the secretes
app.get("/api/getsecretepile/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    // get user secretes
    const sql3 = "SELECT * FROM secretes WHERE user_id = $1";
    const getUserSecretes = await pool.query(sql3, [userId]);
    //get verything in the database
    const getEverything = getUserSecretes.rows; //This is my target
    console.log(getEverything);
    // The data array
    const userSecretes = [];

    getEverything.forEach(
      ({ iv, secrete_id, secrete_title, secrete_description }) => {
        //get and decrypt the title
        const decryptedTitle = decrypt({
          iv: `${iv}`,
          content: `${secrete_title}`,
        });
        //get and decrypt the description
        const decryptedDescription = decrypt({
          iv: `${iv}`,
          content: `${secrete_description}`,
        });
        // put id, title and description in an object
        const secreteObject = {
          secrete_id: secrete_id,
          secrete_title: decryptedTitle,
          secrete_description: decryptedDescription,
        };
        userSecretes.push(secreteObject);
      }
    );
    // send the secretses to the client
    res.send(userSecretes);
    // array to be sent to the client
    console.log(userSecretes);
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;