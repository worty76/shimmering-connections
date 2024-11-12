const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  // Im not gonna encrypt password. maybe later after i done crud
  console.log(user);

  if (user) {
    return res.status(400).json({ message: "This username is already exist" });
  }

  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    role: "user",
  });
  await newUser.save();

  res
    .status(200)
    .json({ message: "Successfully created an user", data: newUser });
};

const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.status(400).json({ message: "This user is not exist" });

  var token = jwt.sign({ id: user._id }, process.env.SECRET);

  const isMatchPassword = user.password === req.body.password;

  if (!isMatchPassword) {
    return res.status(400).json({ message: "Passwords dont match" });
  }

  res.send({
    message: "Successfully logged in",
    user: user,
    token: token,
  });
};

const userController = { register, login };

module.exports = userController;
