const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");
const axios = require("axios");

require("dotenv").config();

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
const geoDataPath = path.resolve(__dirname, "../utils/diaphanhuyen.geojson");
geoData = JSON.parse(fs.readFileSync(geoDataPath, "utf-8"));

const getClosenessScore = (
  currentProvince,
  currentDistrict,
  userProvince,
  userDistrict
) => {
  if (currentProvince === userProvince) {
    if (currentDistrict === userDistrict) {
      // Same district
      return 0;
    }
    // Same Province
    return 1;
  }
  // Not same province
  return 2;
};

const getAgeDifferenceScore = (currentAge, otherAge) => {
  return Math.abs(currentAge - otherAge);
};

const getProfiles = async (req, res) => {
  try {
    const { userId } = req.query;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allUsers = await User.find({ _id: { $ne: userId } });

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
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getProfiles = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let filter = {};

//     if (user.gender === "Men") {
//       filter.gender = "Women";
//     } else if (user.gender === "Women") {
//       filter.gender = "Men";
//     }

//     let query = {
//       _id: { $ne: userId },
//     };

//     // if (user.datingPreferences && user.datingPreferences.length > 0) {
//     //   filter.datingPreferences = user.datingPreferences;
//     // }

//     if (user.type) {
//       filter.type = user.type;
//     }

//     const currentUser = await User.findById(userId)
//       .populate("matches", "_id")
//       .populate("likedProfiles", "_id");

//     const friendIds = currentUser.matches.map((friend) => friend._id);

//     const crushIds = currentUser.likedProfiles.map((crush) => crush._id);

//     console.log("filter", filter);

//     const matches = await User.find(filter)
//       .where("_id")
//       .nin([userId, ...friendIds, ...crushIds]);

//     return res.status(200).json({ matches });
//   } catch (error) {
//     console.error("Error fetching matches:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const likeProfile = async (req, res) => {
  try {
    const { userId, likedUserId, image, comment } = req.body;

    await User.findByIdAndUpdate(likedUserId, {
      $push: {
        receivedLikes: {
          userId: userId,
          image: image,
          comment: comment,
        },
      },
    });
    await User.findByIdAndUpdate(userId, {
      $push: {
        likedProfiles: likedUserId,
      },
    });

    res.status(200).json({ message: "Profile liked successfully" });
  } catch (error) {
    console.error("Error liking profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const receivedLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    const likes = await User.findById(userId)
      .populate("receivedLikes.userId", "firstName imageUrls prompts")
      .select("receivedLikes");

    res.status(200).json({ receivedLikes: likes.receivedLikes });
  } catch (error) {
    console.error("Error fetching received likes:", error);
    res.status(500).json({ message: "Internal server error" });
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
    console.error("Error getting matches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUserData = req.body;
    console.log(userId);
    console.log(req.body);

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
    console.error("Error updating user data:", error);
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

    // Prepare API payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    // Make the API call
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.candidates[0].content.parts[0].text);

    // Extract the generated bio from the response
    const bio = response.data.candidates[0].content.parts[0].text;

    res.status(200).json({ bio: bio });
  } catch (error) {
    console.error(
      "Error generating bio:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error generating bio", error });
  }
};

const userController = {
  getUserData,
  getProfiles,
  likeProfile,
  receivedLikes,
  createMatch,
  getMatches,
  updateProfile,
  generateBio,
};

module.exports = userController;
