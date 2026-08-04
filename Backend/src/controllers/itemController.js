const Item = require("../models/Item");

/**
 * GET /api/items
 * Supports filtering via query params, e.g:
 * /api/items?type=lost&category=Electronics&status=active&search=wallet
 */
async function getItems(req, res, next) {
  try {
    const { type, category, status, search } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const items = await Item.find(filter)
      .populate("postedBy", "name email avatar") // pull in poster's basic info
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ count: items.length, items });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/items/:id
 */
async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate(
      "postedBy",
      "name email avatar"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/items
 * Requires verifyJWT (req.user) and upload.single("photo") middleware before this runs.
 */
async function createItem(req, res, next) {
  try {
    const { type, title, description, category, location, date, claimQuestion, tags } =
      req.body;

    if (!type || !title) {
      return res.status(400).json({ message: "Type and title are required" });
    }

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      date,
      claimQuestion,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      photoUrl: req.file ? req.file.path : undefined, // set by multer-cloudinary
      postedBy: req.user._id,
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/items/:id/status
 * Only the original poster (or an admin) can change an item's status.
 */
async function updateItemStatus(req, res, next) {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    item.status = status;
    await item.save();

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/items/:id
 */
async function deleteItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getItems, getItemById, createItem, updateItemStatus, deleteItem };
