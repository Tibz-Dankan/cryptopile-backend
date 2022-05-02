const Image = require("../models/image");

//TODO: Image upload functionality should be shifted from the frontend to the backend

const uploadUserProfileImage = async (req, res) => {
  const { userId } = req.params;
  const { imageUrl } = req.body;
  const { imageCategory } = req.body;
  // note that userId is the same as imageUrlOwnerId
  // And imageCategory same as imageUrlCategory
  const response = await Image.insertImageUrl(imageCategory, userId, imageUrl);
  if (response.rows.length > 0) {
    res.json(response.rows[0]);
  }
};

module.exports = { uploadUserProfileImage };
