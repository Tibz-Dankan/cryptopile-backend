const db = require("../dbConfig/dbConfig");

const User = {};

// create user
User.createUser = (
  firstName,
  lastName,
  email,
  hashedPassword,
  isVerifiedEmail,
  emailVerificationCode
) => {
  return db.query(
    "INSERT INTO accounts(firstName, lastName, email, password, isVerifiedEmail, verificationCode) VALUES($1,$2,$3,$4,$5,$6)  RETURNING *",
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
User.getUserById = (userId) => {
  return db.query("SELECT * FROM accounts WHERE userId =$1", [userId]);
};

// Get user by Email
User.getUserByEmail = (email) => {
  return db.query("SELECT * FROM accounts WHERE email =$1", [email]);
};
// Get user by Password Rest Code
User.getUserByCode = (code) => {
  return db.query("SELECT * FROM accounts WHERE verificationCode =$1", [code]);
};
// Get all the users
User.getAllUsers = () => {
  return db.query("SELECT * FROM accounts ORDER BY userId ASC");
};

// Update(edit) user
User.updateUserProfile = (userId, firstName, lastName, email) => {
  return db.query(
    "UPDATE accounts SET firstName = $1, lastName = $2, email= $3 WHERE userId = $4",
    [firstName, lastName, email, userId]
  );
};

// update password
User.updatePassword = (newHashedPassword, userId, userEmail) => {
  return db.query(
    "UPDATE accounts SET password = $1 WHERE id = $2 AND email =$3 RETURNING *",
    [newHashedPassword, userId, userEmail]
  );
};

// update verification code
User.updateVerificationCode = (userId, verificationCode) => {
  return db.query(
    "UPDATE accounts SET verificationCode = $1 WHERE userId = $2 RETURNING *",
    [verificationCode, userId]
  );
};

// verify user
User.verifyUser = (userId) => {
  return db.query(
    "UPDATE accounts SET isVerifiedEmail = TRUE WHERE userId = $1 RETURNING *",
    [userId]
  );
};

// Delete user
User.deleteUser = (userId) => {
  return db.query("DELETE FROM accounts WHERE userId = $1", [userId]);
};

module.exports = User;
