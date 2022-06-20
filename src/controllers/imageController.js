const Image = require("../models/image");
var cloudinary = require("cloudinary").v2;

//TODO: Image upload functionality should be shifted from the frontend to the backend

const uploadUserProfileImage = async (req, res) => {
  console.log("Request file" + req.file);
  const { userId } = req.params;
  console.log(userId);
  const { formData } = req.body;
  console.log(formData);
  // const { imageName: imageFile } = req.body;
  // const { imageCategory } = req.body;
  let imageUrl;
  // note that userId is the same as imageUrlOwnerId
  // And imageCategory same as imageUrlCategory
  // console.log(
  //   "Image info " + "userId :" + userId + ",imageFile :",
  //   imageFile + ",imageCategory :" + imageCategory
  // );

  //cloudinary global config
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE,
    secure: true,
  });

  // // Upload image to cloudinary
  // // cloudinary.uploader.upload(imageName, async (error, result) => {
  // cloudinary.uploader.upload(imageFile, async (error, result) => {
  //   console.log("Cloudinary response : " + result, error);
  //   if (!error) {
  //     // const response = await Image.insertImageUrl(
  //     //   imageCategory,
  //     //   userId,
  //     //   imageUrl
  //     // );
  //     // if (response.rows[0]) {
  //     //   return res.status(200).json({ success: "successfully uploaded" });
  //     // }

  //     console.log("Successful Results :" + result);
  //   }
  //   // res.status(201).json({
  //   //   message: "Error occurred while uploading image",
  //   // });
  // });
};

module.exports = { uploadUserProfileImage };
