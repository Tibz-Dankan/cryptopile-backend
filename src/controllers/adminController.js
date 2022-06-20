const User = require("../models/user");
const Admin = require("../models/admin");
const Todo = require("../models/todo");
const Image = require("../models/image");
const { sendEmailVerificationLink } = require("../utils/sendVerificationEmail");
const { randomNumber } = require("../utils/generateRandomNumber");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailExistence = require("email-existence");

const adminGetUsers = async (req, res) => {
  const response = await User.getAllUsers();
  res.json(response.rows);
  console.log("Admin has gotten users");
};

const getAdminProfile = async (req, res) => {
  const { userId } = req.params;
  const response = await Admin.getAdminById(userId);
  res.json(response.rows);
  console.log("Getting admin profile");
};

const adminVerifyUser = async (req, res) => {
  const { userId } = req.params;
  // const { firstName } = req.body;
  const response = await User.verifyUser(userId);
  console.log(
    ` user with id ${response.rows[0].userid} is verified by the admin`
  );
  res.json(response);
};

const adminDeleteUser = async (req, res) => {
  const { userId } = req.params;
  const deleteAllUserTodos = await Todo.deleteAllTodos(userId);
  if (deleteAllUserTodos) {
    const deleteUser = await User.deleteUser(userId);
    console.log("Admin has deleted a user");
    res.json(deleteUser);
  }
};

// create the admin (sign up)
const createAdmin = async (req, res) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { isVerifiedEmail } = req.body;
  const emailVerificationCode = randomNumber();
  const role = "admin";

  emailExistence.check(email, (error, response) => {
    if (error) {
      res.send({
        emailValidationMsg:
          "Sorry, an error occurred during process of validating your email",
      });
      console.log(error);
    }
    if (response) {
      createNewAdmin(
        firstName,
        lastName,
        email,
        password,
        isVerifiedEmail,
        emailVerificationCode,
        role,
        res
      );
      console.log("Email validity is :" + response);
    } else {
      res.send({
        emailValidationMsg:
          "It looks like this email does not exists or it is invalid !",
      });
    }
  });
};

//  function to create new user
const createNewAdmin = async (
  firstName,
  lastName,
  email,
  password,
  isVerifiedEmail,
  emailVerificationCode,
  role,
  res
) => {
  //   check user exits in the database
  const checkEmailInDatabase = await User.getUserByEmail(email);

  if (checkEmailInDatabase.rows.length > 0) {
    res.send({ emailValidationMsg: "This email is already registered !" });
  } else {
    // Store the user details into the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Admin.createAdmin(
      firstName,
      lastName,
      email,
      hashedPassword,
      isVerifiedEmail,
      emailVerificationCode,
      role
    );
    if (newUser.rows.length > 0) {
      const verificationCode = newUser.rows[0].verificationcode;
      const userId = newUser.rows[0].userid;
      // sendEmailVerificationLink(email, userId, verificationCode);
      res.json(newUser.rows[0]);
      console.log(
        `Email sent to: ${email} with id #${userId} and v_code: ${verificationCode}`
      );
    } else {
      console.log("admin signup failed !");
      res.send({ msg: "Internal server error" });
    }
  }
};

// login the admin
const logInAdmin = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const response = await Admin.getAdminByEmail(email);
  console.log("user logging in!");
  // if (isObjectFilled(responseObject) === true) {
  if (response.rows.length > 0) {
    const passwordFromDatabase = response.rows[0].password;
    const isVerifiedEmail = response.rows[0].isverifiedemail;
    const userId = response.rows[0].userid;
    const role = response.rows[0].roles;
    const firstName = response.rows[0].firstname;
    const lastName = response.rows[0].lastname;

    // The Admin image
    let imageUrl;
    const getAdminImageUrl = await Image.getImageUrlById(userId);
    if (getAdminImageUrl.rows.length > 0) {
      imageUrl = getAdminImageUrl.rows[0].imageurl;
    } else {
      imageUrl == null;
    }

    // user info in the jwt -token
    const userInfoToken = jwt.sign(
      { userId, firstName, lastName, role, imageUrl },
      process.env.ACCESS_SECRETE_TOKEN
    );

    // if (isVerifiedEmail == true) {
    if (await bcrypt.compare(password, passwordFromDatabase)) {
      assignTokenToAdmin(res, userId, userInfoToken);
    } else {
      res.send({
        loginStatusMsg: "You have entered an incorrect password!",
      });
      console.log("Incorrect password");
    }
    // }

    // if (isVerifiedEmail == false) {
    //   res.send({
    //     loginStatusMsg:
    //       "This email is not yet Verified, so go to the email inbox and confirm the email we sent to complete registration.",
    //     partlyRegisteredEmail: `${email}`,
    //   });
    //   console.log(`Email ${email} is not yet verified`);
    //   // keep this email being sent to the localStorage
    // }
  }
  if (response.rows.length === 0) {
    res.send({ loginStatusMsg: "You are not an admin!" });
    console.log("Admin does not exist(Not an admin)");
  }
};

// function to assign a token to a user
const assignTokenToAdmin = (res, userId, userInfoToken) => {
  jwt.sign(
    { userId },
    process.env.ACCESS_SECRETE_TOKEN,
    async (err, accessToken) => {
      if (err) {
        res.send({
          Error: err,
          loginStatusMsg: "Error occurred when generating the token",
        });
      } else {
        res.send({
          loginStatusMsg: "You have successfully logged in",
          accessToken,
          userInfoToken,
        });
        console.log("Admin login successful");
      }
    }
  );
};

// Generate the admin key
const generateAdminKey = async (req, res) => {
  const { generatedById } = req.params; // same as userId
  const { createdOn } = req.body;
  const randomKeyString = crypto.randomBytes(16).toString("hex");

  const adminInfo = await Admin.getAdminById(generatedById);
  if (adminInfo.rows.length == 0) {
    return res.status(404).json({ status: "Failed to generate key" });
  }
  const response = await Admin.createAdminKey(
    generatedById,
    randomKeyString,
    createdOn
  );
  if (response.rows.length > 0) {
    res.status(200).json({
      status: "success",
      response,
    });
  } else {
    res.status(404).json({
      status: "fail",
    });
  }
};

//Get admin keys
const getAdminKeys = async (req, res) => {
  const { userId } = req.params;

  const getAdminInfo = await Admin.getAdminById(userId);
  if (getAdminInfo.rows.length == 0) {
    return res.status(404).json({
      status: "fail",
      msg: "You are not an admin",
    });
  }
  const keys = await Admin.getAdminKeysById(userId);
  res.status(200).json({
    status: "success",
    keys: keys.rows,
  });
};

// Verify admin key
const verifyAdminKey = async (req, res) => {
  const { key } = req.body;
  const secreteKey = process.env.SECRETE_ADMIN_KEY;
  const adminKeys = await Admin.getAllAdminKeys();
  let adminKeyFromDb;

  if (adminKeys.rows.length > 0) {
    adminKeys.rows.forEach(
      ({ adminid, generatedby, adminkey, createdon, usedby }) => {
        if (key === adminkey) {
          adminKeyFromDb = adminkey;
        }
      }
    );
  }
  if (key === secreteKey || key === adminKeyFromDb) {
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(200).json({
      status: "fail",
      msg: "Incorrect key",
    });
  }
};

module.exports = {
  adminGetUsers,
  getAdminProfile,
  adminVerifyUser,
  adminDeleteUser,
  createAdmin,
  logInAdmin,
  generateAdminKey,
  getAdminKeys,
  verifyAdminKey,
};
