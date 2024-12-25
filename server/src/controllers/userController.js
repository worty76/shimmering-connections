const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cloudinary = require("../utils/cloudinary");
const formidable = require("formidable");

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const geminiApiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ message: "User found", user });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
};

const getClosenessScore = (
  currentProvince,
  currentDistrict,
  userProvince,
  userDistrict
) => {
  if (currentProvince === userProvince) {
    if (currentDistrict === userDistrict) {
      return 0;
    }
    return 1;
  }
  return 2;
};

const getAgeDifferenceScore = (currentAge, otherAge) => {
  return Math.abs(currentAge - otherAge);
};

const getProfiles = async (req, res) => {
  try {
    const { userId, applyPreferences } = req.query;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let filters = { _id: { $ne: userId } };

    if (applyPreferences === "true") {
      const genderFilter = currentUser.datingPreferences.gender?.length
        ? { gender: { $in: currentUser.datingPreferences.gender } }
        : {};

      const interestsFilter = currentUser.datingPreferences.interests?.length
        ? { interests: { $in: currentUser.datingPreferences.interests } }
        : {};

      const zodiacFilter = currentUser.datingPreferences.zodiac?.length
        ? { zodiac: { $in: currentUser.datingPreferences.zodiac } }
        : {};

      const passionsFilter = currentUser.datingPreferences.passions?.length
        ? { passions: { $in: currentUser.datingPreferences.passions } }
        : {};

      const educationFilter = currentUser.datingPreferences.education?.length
        ? { education: { $in: currentUser.datingPreferences.education } }
        : {};

      const religionFilter = currentUser.datingPreferences.religion?.length
        ? { religion: { $in: currentUser.datingPreferences.religion } }
        : {};

      filters = {
        ...filters,
        ...genderFilter,
        ...interestsFilter,
        ...zodiacFilter,
        ...passionsFilter,
        ...educationFilter,
        ...religionFilter,
      };
    }

    const allUsers = await User.find(filters);

    const usersWithScores = allUsers.map((user) => {
      const geoScore = getClosenessScore(
        currentUser.province,
        currentUser.district,
        user.province,
        user.district
      );

      const ageDifferenceScore = getAgeDifferenceScore(
        currentUser.age,
        user.age
      );

      const totalScore = geoScore + ageDifferenceScore;

      return {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        province: user.province,
        district: user.district,
        imageUrls: user.imageUrls,
        prompts: user.prompts,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        geoScore,
        ageDifferenceScore,
        totalScore,
      };
    });

    const matches = usersWithScores.sort((a, b) => a.totalScore - b.totalScore);

    res.status(200).json({ matches });
  } catch (error) {
    console.error("Error finding closest users:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const generateBio = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prompts = user.prompts
      .map((prompt) => `${prompt.question}: ${prompt.answer}`)
      .join("\n");

    const promptText = `
      Generate a creative, engaging, and personalized bio for a user based on the following interests:
      ${prompts}
      Make the bio friendly and fun, but no longer than 100 characters.
    `;

    const result = await model.generateContent(promptText);

    const bio = result.response.candidates[0].content.parts[0].text;
    res.status(200).json({ bio });
  } catch (error) {
    console.error("Error generating bio:", error);
    res.status(500).json({ message: "Error generating bio", error });
  }
};

const updateBio = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio } = req.body;

    if (!userId || !bio) {
      return res.status(400).json({ message: "User ID and bio are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "Bio updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateImages = async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);
    let { userId, imageUrls, removedImages } = fields;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const parsedImageUrls = Array.isArray(imageUrls)
      ? imageUrls
      : JSON.parse(imageUrls);

    const uploadedImageUrls = [];

    for (const file of parsedImageUrls.filter((url) => url !== "")) {
      if (file.startsWith("http")) {
        uploadedImageUrls.push(file);
      } else {
        const uploadResponse = await cloudinary.uploader.upload(file, {
          folder: "user_uploads",
        });
        uploadedImageUrls.push(uploadResponse.secure_url);
      }
    }

    if (removedImages) {
      for (const removedImage of removedImages) {
        if (removedImage.startsWith("http")) {
          const publicId = removedImage.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`user_uploads/${publicId}`);
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { imageUrls: uploadedImageUrls },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Images updated successfully",
      updatedImages: uploadedImageUrls,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, keepExtensions: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ fields, files });
    });
  });

const likeProfile = async (req, res) => {
  try {
    const { userId, likedUserId, image, comment } = req.body;

    await User.findByIdAndUpdate(likedUserId, {
      $push: {
        receivedLikes: {
          userId,
          image,
          comment,
        },
      },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { likedProfiles: likedUserId },
    });

    res.status(200).json({ message: "Profile liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const receivedLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    const likes = await User.findById(userId)
      .populate("receivedLikes.userId")
      .select("receivedLikes");

    res.status(200).json({ receivedLikes: likes.receivedLikes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const createMatch = async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { matches: currentUserId },
      $pull: { likedProfiles: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { matches: selectedUserId },
    });

    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: { receivedLikes: { userId: selectedUserId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "ReceivedLikes updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating a match", error });
  }
};

const getMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "matches",
      "firstName imageUrls"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matches = user.matches;

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUserData = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUserData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User data updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const userController = {
  getUserData,
  getProfiles,
  generateBio,
  updateBio,
  updateImages,
  likeProfile,
  receivedLikes,
  createMatch,
  getMatches,
  updateProfile,
};

module.exports = userController;
