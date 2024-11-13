const User = require("../models/user");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, name, password });

    newUser.verificationToken = crypto.randomBytes(16).toString("hex");

    await newUser.save();

    // sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", err });
  }
};

const login = async (req, res) => {
  const secretKey = crypto.randomBytes(16).toString("hex");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

const verifyGender = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    );
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    res.status(200).json({ message: "User gender updated Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error });
  }
};

const authController = {
  login,
  register,
  verifyGender,
};

module.exports = authController;
