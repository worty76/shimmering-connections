const User = require("../models/user");

const checkRole = (role) => async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });

  console.log(user);

  if (user.role !== role) {
    return res.status(400).json({ message: "Role is invalid" });
  } else {
    next();
  }
};

module.exports = checkRole;
