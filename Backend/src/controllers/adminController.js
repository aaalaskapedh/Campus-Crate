const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const Report = require("../models/Report");

/**
 * GET /api/admin/dashboard
 * One combined endpoint for everything the admin panel needs on load,
 * instead of the frontend making 4 separate requests.
 */
async function getDashboard(req, res, next) {
  try {
    const [pendingClaims, unresolvedReports, totalItems, totalUsers] = await Promise.all([
      Claim.find({ status: "pending" })
        .populate("itemId", "title type")
        .populate("claimantId", "name email"),
      Report.find({ resolved: false }).populate("itemId", "title").populate(
        "reportedBy",
        "name email"
      ),
      Item.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      stats: { totalItems, totalUsers },
      pendingClaims,
      unresolvedReports,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/users/:id/block
 * Toggles a user's blocked status.
 */
async function toggleBlockUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({ message: `User ${user.blocked ? "blocked" : "unblocked"}`, user });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard, toggleBlockUser };
