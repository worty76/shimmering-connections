const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  bio: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  datingPreferences: [
    {
      type: String,
    },
  ],
  lookingFor: {
    type: String,
    required: true,
  },
  imageUrls: [
    {
      type: String,
    },
  ],
  prompts: [
    {
      question: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
  ],
  //   genderPreference: {
  //     type: String,
  //     enum: ['male', 'female', 'both'],
  //     required: true,
  //   },
  //   ageRangePreference: {
  //     min: {
  //       type: Number,
  //       default: 18,
  //     },
  //     max: {
  //       type: Number,
  //       default: 99,
  //     },
  //   },
  likedProfiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  receivedLikes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      image: {
        type: String,
      },
      comment: {
        type: String,
      },
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  visibility: {
    type: String,
    enum: ["public", "hidden"],
    default: "public",
  },
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  notificationPreferences: {
    // Define notification preferences here
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
