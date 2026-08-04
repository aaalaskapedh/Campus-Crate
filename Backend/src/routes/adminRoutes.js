const express = require("express");
const { getDashboard, toggleBlockUser } = require("../controllers/adminController");
const verifyJWT = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.use(verifyJWT, isAdmin); // every route below requires an authenticated admin

router.get("/dashboard", getDashboard);
router.patch("/users/:id/block", toggleBlockUser);

module.exports = router;
