const User = require("../models/user");
const jwt = require("jsonwebtoken");
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

const getProfiles = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let filter = {};

    if (user.gender === "Men") {
      filter.gender = "Women";
    } else if (user.gender === "Women") {
      filter.gender = "Men";
    }

    let query = {
      _id: { $ne: userId },
    };

    if (user.datingPreferences && user.datingPreferences.length > 0) {
      filter.datingPreferences = user.datingPreferences;
    }
    if (user.type) {
      filter.type = user.type;
    }

    const currentUser = await User.findById(userId)
      .populate("matches", "_id")
      .populate("likedProfiles", "_id");

    const friendIds = currentUser.matches.map((friend) => friend._id);

    const crushIds = currentUser.likedProfiles.map((crush) => crush._id);

    console.log("filter", filter);

    const matches = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...crushIds]);

    return res.status(200).json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendLike = async (req, res) => {
  try {
    const { currentID, selectedId } = req.body;
    await user.findByIdAndUpdate(
      selectedId,
      {
        $push: { receivedLikes: currentID },
      },
      { new: true }
    );
    await user.findByIdAndUpdate(
      currentID,
      {
        $push: { crushes: selectedId },
      },
      { new: true }
    );
    res.status(200).json({ message: "Like sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const userController = { getUserData, getProfiles, sendLike };

module.exports = userController;
