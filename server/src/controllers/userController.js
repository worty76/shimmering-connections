const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");
const axios = require("axios");
const cloudinary = require("../utils/cloudinary");
const formidable = require("formidable");

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
  // Not same province, far district
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
      .populate("receivedLikes.userId")
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

const updateBio = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bio } = req.body;
    console.log(userId + " " + bio);

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
    console.error("Error updating bio:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateImages = async (req, res) => {
  try {
    const { fields, files } = await doSomethingWithNodeRequest(req);
    let { userId, imageUrls, removedImages } = fields;

    console.log("Raw imageUrls:", imageUrls);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    let parsedImageUrls = [];

    if (typeof imageUrls === "string") {
      try {
        parsedImageUrls = JSON.parse(imageUrls);
      } catch (error) {
        return res.status(400).json({ message: "Invalid imageUrls format." });
      }
    } else if (Array.isArray(imageUrls)) {
      parsedImageUrls = imageUrls;
    } else {
      return res.status(400).json({ message: "Invalid imageUrls format." });
    }

    console.log("Parsed imageUrls:", parsedImageUrls);

    const uploadedImageUrls = [];
    const imageFiles = parsedImageUrls.filter((url) => url !== "") || [];

    for (const file of imageFiles) {
      if (file.startsWith("http")) {
        uploadedImageUrls.push(file);
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

    if (removedImages && Array.isArray(removedImages)) {
      for (const removedImage of removedImages) {
        if (removedImage.startsWith("http")) {
          const publicId = removedImage.split("/").pop().split(".")[0];
          try {
            await cloudinary.uploader.destroy(`user_uploads/${publicId}`);
          } catch (deleteError) {
            console.error(`Error deleting image: ${removedImage}`, deleteError);
          }
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
    console.error("Error updating images:", error);
    res.status(500).json({ message: "Internal server error", error });
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
      console.log(fields + files);
      resolve({ fields, files });
    });
  });
}

const userController = {
  getUserData,
  getProfiles,
  likeProfile,
  receivedLikes,
  createMatch,
  getMatches,
  updateProfile,
  generateBio,
  updateBio,
  updateImages,
};

module.exports = userController;
