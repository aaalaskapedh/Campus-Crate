const mongoose = require("mongoose");

// A simple model for reporting spam/inappropriate posts or bad-faith claims.
const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
