const db = require("../dbConfig/dbConfig");

const Image = {};

// Insert image url in the database
Image.insertImageUrl = (imageCategory, userId, imageUrl) => {
  return db.query(
    "INSERT INTO imageUrl(imageUrlCategory,imageUrlOwnerId,imageUrl) VALUES($1,$2,$3) RETURNING *",
    [imageCategory, userId, imageUrl]
  );
};
// Get image url using userId (imageUrlOwnerId)
Image.getImageUrlById = (ownerId) => {
  return db.query("SELECT * FROM imageUrl WHERE  imageUrlOwnerId = $1", [
    ownerId,
  ]);
};

// update image url
Image.updateImageUrl = (userId, imageUrl) => {
  return db.query(
    "UPDATE imageUrl SET imageUrl = $1 WHERE imageUrlOwnerId = $2 RETURNING *",
    [userId, imageUrl]
  );
};

// Delete image url
Image.DeleteImageUrl = (userId) => {
  return db.query("DELETE FROM imageUrl WHERE imageUrlOwnerId = $1", [userId]);
};

module.exports = Image;
