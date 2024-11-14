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
  console.log("Called");
  const { userId, gender, turnOns, lookingFor } = req.query;
  try {
    let filter = { gender: gender == "male" ? "female" : "male" };
    if (turnOns) filter.turnOns = { $in: turnOns };
    if (lookingFor) filter.lookingFor = { $in: lookingFor };

    const profiles = await User.findById(userId)
      .populate("matches", "_id")
      .populate("crushes", "_id");

    const matches = profiles.matches.map((match) => match._id);

    const crushes = profiles.crushes.map((crush) => crush._id);

    const data = await User.find({ ...filter })
      .where("_id")
      .nin([userId, ...matches, ...crushes]);

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profiles", error });
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
