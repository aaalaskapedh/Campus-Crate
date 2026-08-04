const Report = require("../models/Report");

/**
 * POST /api/report
 * Any logged-in user can report a suspicious/spam item.
 */
async function createReport(req, res, next) {
  try {
    const { itemId, reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "A reason is required" });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      itemId,
      reason,
    });

    res.status(201).json({ report });
  } catch (error) {
    next(error);
  }
}

module.exports = { createReport };
