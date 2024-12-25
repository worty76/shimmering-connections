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
  zodiac: {
    type: String,
  },
  passions: [
    {
      type: String,
    },
  ],
  education: {
    type: String,
  },
  religion: {
    type: String,
  },
  interests: [
    {
      type: String,
    },
  ],
  datingPreferences: {
    gender: [
      {
        type: String,
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    zodiac: [
      {
        type: String,
      },
    ],
    passions: [
      {
        type: String,
      },
    ],
    education: [
      {
        type: String,
      },
    ],
    religion: [
      {
        type: String,
      },
    ],
  },
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
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    push: {
      type: Boolean,
      default: true,
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
