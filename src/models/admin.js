const db = require("../dbConfig/dbConfig");

const Admin = {};

// Create admin key
Admin.createAdminKey = (generatedBy, adminKey, createdOn) => {
  return db.query(
    "INSERT INTO adminKeys(generatedBy,adminKey,createdOn) VALUES($1,$2,$3) RETURNING *",
    [generatedBy, adminKey, createdOn]
  );
};
// Get the admin keys
Admin.getAdminKeysById = (generatedById) => {
  return db.query("SELECT * FROM adminKeys WHERE generatedBy = $1", [
    generatedById,
  ]);
};
// Get the admin keys
Admin.getAllAdminKeys = () => {
  return db.query("SELECT * FROM adminKeys");
};
// update the admin key to a given user
Admin.updateUserOfKey = (key, keyUsedBy) => {
  return db.query("UPDATE adminKeys SET usedBy = $1 WHERE adminKey = $2", [
    keyUsedBy,
    key,
  ]);
};
// Get the admin profile
Admin.getAdminById = (userId) => {
  return db.query(
    "SELECT * FROM accounts WHERE userId = $1 AND roles ='admin'",
    [userId]
  );
};
// get the admin by email
Admin.getAdminByEmail = (email) => {
  return db.query(
    "SELECT * FROM accounts WHERE email = $1 AND roles ='admin'",
    [email]
  );
};

// create an admin
Admin.createAdmin = (
  firstName,
  lastName,
  email,
  hashedPassword,
  isVerifiedEmail,
  emailVerificationCode,
  role
) => {
  return db.query(
    "INSERT INTO accounts(firstName, lastName, email, password, isVerifiedEmail, verificationCode, roles) VALUES($1,$2,$3,$4,$5,$6, $7)  RETURNING *",
    [
      firstName,
      lastName,
      email,
      hashedPassword,
      isVerifiedEmail,
      emailVerificationCode,
      role,
    ]
  );
};

module.exports = Admin;
