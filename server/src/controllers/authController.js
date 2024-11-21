const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary");
const formidable = require("formidable");

const register = async (req, res) => {
  try {
    const { fields, files } = await doSomethingWithNodeRequest(req);
    // console.log("Parsed fields:", fields);
    // console.log("Parsed files:", files);

    let { prompts, imageUrls, ...userData } = fields;

    if (typeof imageUrls === "string") {
      try {
        imageUrls = JSON.parse(imageUrls);
      } catch (parseError) {
        return res.status(400).json({
          message: "Invalid format for images",
          error: parseError,
        });
      }
    }

    if (typeof prompts === "string") {
      try {
        prompts = JSON.parse(prompts);
      } catch (parseError) {
        return res.status(400).json({
          message: "Invalid format for prompts",
          error: parseError,
        });
      }
    }

    if (Array.isArray(prompts)) {
      prompts = prompts
        .map((prompt) => {
          if (
            typeof prompt.question === "string" &&
            typeof prompt.answer === "string"
          ) {
            return {
              question: prompt.question,
              answer: prompt.answer,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
    } else {
      return res.status(400).json({
        message:
          "Invalid format for prompts. Must be an array of objects with 'question' and 'answer' fields.",
      });
    }

    userData.prompts = prompts || [];

    if (userData.dateOfBirth) {
      const [day, month, year] = userData.dateOfBirth.split("/").map(Number);
      if (!day || !month || !year) {
        return res.status(400).json({
          message: "Invalid format for dateOfBirth. Must be 'DD/MM/YYYY'.",
        });
      }
      const today = new Date();
      let age = today.getFullYear() - year;
      const birthMonthDay = new Date(year, month - 1, day);
      if (today < birthMonthDay) {
        age -= 1;
      }
      userData.age = age;
    } else {
      return res.status(400).json({ message: "dateOfBirth is required." });
    }

    const uploadedImageUrls = [];
    if (imageUrls) {
      const imageFiles = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      for (const file of imageFiles) {
        if (file === "") {
          uploadedImageUrls.push(file);
          continue;
        } else {
          try {
            const uploadResponse = await cloudinary.uploader.upload(file, {
              folder: "user_uploads",
            });
            uploadedImageUrls.push(uploadResponse.secure_url);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            return res
              .status(500)
              .json({ message: "Image upload failed", error: uploadError });
          }
        }
      }
    }

    userData.imageUrls = Array.isArray(imageUrls)
      ? [...uploadedImageUrls]
      : uploadedImageUrls;

    const newUser = new User(userData);
    await newUser.save();

    const secretKey = crypto.randomBytes(32).toString("hex");
    const token = jwt.sign({ userId: newUser._id }, secretKey, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const secretKey = crypto.randomBytes(32).toString("hex");
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

    res.status(200).json({ message: "User logged in successfully", token });
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
      { gender },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    res.status(200).json({ message: "User gender updated Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error });
  }
};

function doSomethingWithNodeRequest(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, keepExtensions: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      console.log("Parsed Fields: ", fields);
      console.log("Parsed Files: ", files);
      resolve({ fields, files });
    });
  });
}

const authController = {
  login,
  register,
  verifyGender,
};

module.exports = authController;
