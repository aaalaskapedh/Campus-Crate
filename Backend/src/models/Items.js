const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    location: String,
    date: Date,
    photoUrl: String,
    status: {
      type: String,
      enum: ["active", "claimed", "returned"],
      default: "active",
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    claimQuestion: String,
    tags: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
