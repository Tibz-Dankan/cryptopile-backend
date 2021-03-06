const jwt = require("jsonwebtoken");

// The verify function
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader !== "undefined") {
    const bearer = authHeader.split(" ");
    accessToken = bearer[1];
    // console.log("token :", accessToken);
    jwt.verify(accessToken, process.env.ACCESS_SECRETE_TOKEN, (err, userId) => {
      if (err) {
        res.send({
          Error: err,
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
