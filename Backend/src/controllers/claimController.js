const Claim = require("../models/Claim");
const Item = require("../models/Item");

/**
 * POST /api/claim
 * A user claims an item, answering the poster's claimQuestion as proof.
 */
async function createClaim(req, res, next) {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't claim your own post" });
    }

    // Prevent the same user from spamming multiple claims on one item
    const existing = await Claim.findOne({ itemId, claimantId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already submitted a claim for this item" });
    }

    const claim = await Claim.create({
      itemId,
      claimantId: req.user._id,
      message,
    });

    res.status(201).json({ claim });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/claim/item/:itemId
 * Lets the item's poster see all claims submitted for their post.
 */
async function getClaimsForItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these claims" });
    }

    const claims = await Claim.find({ itemId: req.params.itemId })
      .populate("claimantId", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ claims });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/claim/:id
 * The item's poster approves or rejects a claim.
 * Approving automatically marks the item as "returned".
 */
async function updateClaimStatus(req, res, next) {
  try {
    const { status } = req.body; // "approved" or "rejected"

    const claim = await Claim.findById(req.params.id).populate("itemId");
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    const item = claim.itemId;
    const isOwner = item.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this claim" });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      item.status = "returned";
      await item.save();
    }

    res.status(200).json({ claim });
  } catch (error) {
    next(error);
  }
}

module.exports = { createClaim, getClaimsForItem, updateClaimStatus };
