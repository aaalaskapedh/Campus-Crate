const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can share an email
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String, // links this user to their Google account
      unique: true,
      sparse: true, // allows multiple docs with no googleId without violating uniqueness
    },
    avatar: {
      type: String, // profile picture URL from Google
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
