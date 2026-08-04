const express = require("express");
const { googleLogin, getMe } = require("../controllers/authController");
const verifyJWT = require("../middleware/auth");

const router = express.Router();

router.post("/google", googleLogin);
router.get("/me", verifyJWT, getMe);

module.exports = router;
