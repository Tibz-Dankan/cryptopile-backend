const { dbConnection } = require("../dbConfig/dbConfig");

const User = {};

// create user
User.createUser = async (
  firstName,
  lastName,
  email,
  hashedPassword,
  isVerifiedEmail,
  emailVerificationCode
) => {
  return await dbConnection.query(
    "INSERT INTO accounts(firstName, lastName, email, password, isVerifiedEmail, verificationCode) VALUES(?,?,?,?,?,?)  RETURNING *",
    [
      firstName,
      lastName,
      email,
      hashedPassword,
      isVerifiedEmail,
      emailVerificationCode,
    ]
  );
};

// Get user by Id
User.getUserById = async (userId) => {
  return await dbConnection.query("SELECT * FROM accounts WHERE userId =?", [
    userId,
  ]);
};

// Get user by Email
User.getUserByEmail = async (email) => {
  return await dbConnection.query(
    "SELECT * FROM accounts WHERE email =?",
    [email],
    function (err, results) {
      console.log(results);
    }
  );
};
// Get user by Password Rest Code
User.getUserByCode = (code) => {
  return dbConnection.query(
    "SELECT * FROM accounts WHERE verificationCode =?",
    [code]
  );
};
// Get all the users
User.getAllUsers = () => {
  return dbConnection.query("SELECT * FROM accounts ORDER BY userId ASC");
};

// Update(edit) user
User.updateUserProfile = (userId, firstName, lastName, email) => {
  return dbConnection.query(
    "UPDATE accounts SET firstName = $1, lastName = $2, email= $3 WHERE userId = $4",
    [firstName, lastName, email, userId]
  );
};

// update password
User.updatePassword = (newHashedPassword, userId, userEmail) => {
  return dbConnection.query(
    "UPDATE accounts SET password = $1 WHERE id = $2 AND email =$3 RETURNING *",
    [newHashedPassword, userId, userEmail]
  );
};

// update verification code
User.updateVerificationCode = (userId, verificationCode) => {
  return dbConnection.query(
    "UPDATE accounts SET verificationCode = $1 WHERE userId = $2 RETURNING *",
    [verificationCode, userId]
  );
};

// verify user
User.verifyUser = (userId) => {
  return dbConnection.query(
    "UPDATE accounts SET isVerifiedEmail = TRUE WHERE userId = $1 RETURNING *",
    [userId]
  );
};

// Delete user
User.deleteUser = (userId) => {
  return dbConnection.query("DELETE FROM accounts WHERE userId = $1", [userId]);
};

module.exports = User;
