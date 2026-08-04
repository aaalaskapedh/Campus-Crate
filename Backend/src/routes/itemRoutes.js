const express = require("express");
const {
  getItems,
  getItemById,
  createItem,
  updateItemStatus,
  deleteItem,
} = require("../controllers/itemController");
const verifyJWT = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getItems); // public - anyone can browse
router.get("/:id", getItemById); // public - anyone can view a single item

// Everything below requires login
router.post("/", verifyJWT, upload.single("photo"), createItem);
router.patch("/:id/status", verifyJWT, updateItemStatus);
router.delete("/:id", verifyJWT, deleteItem);

module.exports = router;
