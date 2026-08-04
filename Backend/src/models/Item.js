const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String, // e.g. "Electronics", "ID Card", "Bag"
      trim: true,
    },
    location: {
      type: String, // where it was lost/found on campus
      trim: true,
    },
    date: {
      type: Date, // when it was lost/found
    },
    photoUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "claimed", "returned"],
      default: "active",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // lets us populate() the poster's details later
      required: true,
    },
    claimQuestion: {
      type: String, // a verification question only the true owner could answer
      trim: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Index to make search/filtering fast as the collection grows
itemSchema.index({ title: "text", description: "text", category: "text" });

module.exports = mongoose.model("Item", itemSchema);
