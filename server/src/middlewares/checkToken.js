const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const checkToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);

      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = await User.findById({ _id: decoded.id }).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
};

module.exports = checkToken;
