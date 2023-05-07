const User = require("../models/user");
const Image = require("../models/image");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailExistence = require("email-existence");
const { sendEmailVerificationLink } = require("../utils/sendVerificationEmail");
const { randomNumber } = require("../utils/generateRandomNumber");
require("dotenv").config();

const signup = async (req, res) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { isVerifiedEmail } = req.body;
  const emailVerificationCode = randomNumber();

  // // TODO: To be uncommented when pushing to production
  // emailExistence.check(email, (response, error) => {
  //   if (error) {
  //     res.send({
  //       emailValidationMsg:
  //         "Sorry, an error occurred during process of validating your email",
  //     });
  //     console.log(error);
  //   }
  //   if (response) {
  //     createNewUser(
  //       firstName,
  //       lastName,
  //       email,
  //       password,
  //       isVerifiedEmail,
  //       emailVerificationCode,
  //       res
  //     );
  //     console.log("Email validity is :" + response);
  //   } else {
  //     res.send({
  //       emailValidationMsg:
  //         "It looks like this email does not exists or it is invalid !",
  //     });
  //   }
  // });

  createNewUser(
    firstName,
    lastName,
    email,
    password,
    isVerifiedEmail,
    emailVerificationCode,
    res
  );
};

//  function to create new user
const createNewUser = async (
  firstName,
  lastName,
  email,
  password,
  isVerifiedEmail,
  emailVerificationCode,
  res
) => {
  //   check user exits in the database
  const checkEmailInDatabase = await User.getUserByEmail(email);

  if (checkEmailInDatabase.rows.length > 0) {
    res.send({ emailValidationMsg: "This email is already registered !" });
  } else {
    // Store the user details into the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      isVerifiedEmail,
      emailVerificationCode
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
      console.log("user signup failed !");
      res.send({ msg: "Internal server error" });
    }
  }
};

// Log in the user
const login = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const response = await User.getUserByEmail(email);
  console.log("user logging in!");
  // if (isObjectFilled(responseObject) === true) {
  if (response.rows.length > 0) {
    const passwordFromDatabase = response.rows[0].password;
    const isVerifiedEmail = response.rows[0].isverifiedemail;
    const userId = response.rows[0].userid;
    const role = response.rows[0].roles;
    const firstName = response.rows[0].firstname;
    const lastName = response.rows[0].lastname;

    // The user image
    let imageUrl;
    const getUserImageUrl = await Image.getImageUrlById(userId);
    if (getUserImageUrl.rows.length > 0) {
      imageUrl = getUserImageUrl.rows[0].imageurl;
    } else {
      imageUrl = null;
    }
    // image jwt -token
    const userImageUrlToken = jwt.sign(
      { imageUrl },
      process.env.ACCESS_SECRETE_TOKEN
    );
    // user info in the jwt -token
    const userInfoToken = jwt.sign(
      { userId, firstName, lastName, role, imageUrl },
      process.env.ACCESS_SECRETE_TOKEN
    );

    // if (isVerifiedEmail == true) {
    if (await bcrypt.compare(password, passwordFromDatabase)) {
      assignTokenToUser(res, userId, userInfoToken);
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
    res.send({ loginStatusMsg: "User does not exist!" });
    console.log("User does not exist");
  }
};

// function to assign a token to a user
const assignTokenToUser = (res, userId, userInfoToken) => {
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
        console.log("User Login successful");
      }
    }
  );
};

const verifyUser = async (req, res) => {
  const { id } = req.params;
  const { verificationCode } = req.body;
  const userInfo = await User.getUserById(id);
  if (userInfo.rows.length > 0) {
    const codeStoredInDatabase = userInfo.rows[0].verificationcode;
    const userEmail = userInfo.rows[0].email;
    const userId = userInfo.rows[0].userid;
    console.log(`Email be to verified exists: ${userEmail}`);
    if (codeStoredInDatabase === verificationCode) {
      const updateVerificationStatusToTrue = User.verifyUser(userId);
      if (updateVerificationStatusToTrue.rows.length > 0) {
        console.log(`${userEmail} has been verified`);
        res.send({
          verificationStatusMsg: userEmail + " has been fully verified",
          code: codeStoredInDatabase,
        });
      } else {
        console.log(`${userEmail}'s verification failed `);
        res.send({
          verificationStatusMsg:
            "Internal server error during email verification process",
        });
      }
    }
    if (codeStoredInDatabase !== verificationCode) {
      console.log("Failed to match the client and server codes!");
      res.send({
        verificationStatusMsg:
          "Sorry, an error occurred during email verification process",
      });
    }
  }
  if (userInfo.rows.length == 0) {
    console.log("The user altered the verification link");
    res.send({
      verificationStatusMsg:
        "Sorry, an error occurred during email verification process",
    });
  }
};

// Get user profile

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const response = await User.getUserById(userId);
  console.log(response.rows);
  if (response.rows.length == 0) {
    return res.send({ data: "user does not exists" });
  }
  const userIdFromDatabase = response.rows[0].userid;
  const firstName = response.rows[0].firstname;
  const lastName = response.rows[0].lastname;
  const email = response.rows[0].email;
  const isverifiedemail = response.rows[0].isverifiedemail;
  if (response.rows.length > 0) {
    // get the url from the database
    // note that imageUrlOwnerId is the same as UserId

    const getImageUrl = await Image.getImageUrlById(userId);
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
};

//Edit User Profile
//TODO: full functionality to be implemented later
const editUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  console.log("Editing profile");
  const getUserInfo = await User.getUserById(userId);
  const emailFromDatabase = getUserInfo.rows[0].email;
  // if (emailFromDatabase === email) {  // To implemented later
  if (emailFromDatabase !== null) {
    // This is temporary and should be removed
    await User.updateUserProfile(
      userId,
      firstName,
      lastName,
      emailFromDatabase
    );
    res.status(200).json({ status: "success" }); //shorthand if statement
  } else {
    // // check the email validity and send email verification link
    // emailExistence.check(email, async (error, response) => {
    //   if (error) {
    //     res.status(200).json({
    //       emailValidationMsg:
    //         "Sorry, an error occurred during process of validating your email",
    //     });
    //     console.log(error);
    //   }
    //   if (response) {
    //     // TODO: First check  the email email to ensure that its does not exist in the database
    //     // update user profile
    //     const updateUserProfile = await User.updateUserProfile(
    //       userId,
    //       firstName,
    //       lastName,
    //       email
    //     );
    //     console.log(updateUserProfile); // to be
    //     updateUserProfile.rows[0] &&
    //       res.status(200).json({ status: "success" }); //shorthand if statement
    //   }
    // });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  const { userEmail } = req.body;
  passwordResetCode = randomNumber();
  const response = await User.getUserByEmail(userEmail);
  if (response.rows.length > 0) {
    const userId = response.rows.userid;
    const updateCodeStoredInDatabase = await User.verifyUser(userId);
    if (updateCodeStoredInDatabase.rows.length > 0) {
      sendPasswordResetCode(userEmail, passwordResetCode);
      res.send(updateCodeStoredInDatabase.rows[0]);
      console.log(
        `Sending an email to "${userEmail}" with the code: ${passwordResetCode}`
      );
    } else {
      res.send({
        forgotPasswordMsg:
          "Sending password reset code failed, you can  resend ",
      });
      console.log("Failed to update code in te database!");
    }
  }
  //  else {
  if (updateCodeStoredInDatabase.rows.length == 0) {
    res.send({
      forgotPasswordMsg:
        "This email is not registered with us, so can not reset password",
    });
    console.log(`Unregistered email trying to reset password `);
  }
};

const passwordResetCode = async (req, res) => {
  const { passwordResetCode } = req.body;
  const response = await User.getUserByCode(passwordResetCode);
  if (response.rows.length > 0) {
    res.send(response.rows[0]);
    console.log(
      "password reset code: " +
        response.rows[0].verificationCode +
        " is correct and valid"
    );
  } else {
    console.log("password reset code is wrong!");
    res.send({
      PasswordRestCodeVerificationMsg: "Wrong Password Reset Code!",
    });
  }
};

const updatePassword = async (req, res) => {
  const { userEmail } = req.body;
  const { newPassword } = req.body;
  const { userId } = req.params;
  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  const response = await User.updatePassword(
    newHashedPassword,
    userId,
    userEmail
  );
  if (response.rows.length > 0) {
    console.log("Password reset to: " + response.rows[0].password);
    res.send({ passwordResetMsg: "password-reset-successful" });
  } else {
    res.send({ passwordResetMsg: "Can not reset password" });
  }
};

const reSendVerificationLink = async (req, res) => {
  const { partlyRegisteredEmail } = req.body;
  const response = await User.getUserByEmail(partlyRegisteredEmail);

  if (response.rows.length > 0) {
    const userEmail = response.rows[0].email;
    const userId = response.rows[0].userid;
    const verificationCode = randomNumber();
    const updateVerificationCode = await User.updateVerificationCode(
      userId,
      verificationCode
    );
    if (updateVerificationCode.rows.length > 0) {
      // sendEmailVerificationLink(userEmail, userId, verificationCode);
      console.log(`Email resent to ${userEmail} with code ${verificationCode}`);
      res.send({
        verificationLinkStatus: "verification email sent successfully!",
      });
    } else {
      console.log("Failed to update the verification code ! in the database");
      res.send({
        verificationLinkStatus: "Internal server error occurred !",
      });
    }
  }
  if (response.rows.length === 0) {
    res.send({ verificationLinkStatus: "An error occurred email not sent" });
  }
};

module.exports = {
  signup,
  login,
  verifyUser,
  getUserProfile,
  editUserProfile,
  forgotPassword,
  passwordResetCode,
  updatePassword,
  reSendVerificationLink,
};
