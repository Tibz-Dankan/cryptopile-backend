const jwt = require("jsonwebtoken");

// The verify function
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader !== "undefined") {
    const bearer = authHeader.split(" ");
    accessToken = bearer[1];
    jwt.verify(accessToken, process.env.ACCESS_SECRETE_TOKEN, (err, userId) => {
      if (err) {
        res.send({
          Error: err,
          messageDisplay: "Login required in order to add your information",
          messageCheck: "error",
        });
      } else {
        req.id = userId;
        next();
      }
    });
  } else {
    res.send({ msg: "Token undefined" });
  }
};

module.exports = { verifyToken };
