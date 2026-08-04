const express = require("express");
const { createReport } = require("../controllers/reportController");
const verifyJWT = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyJWT, createReport);

module.exports = router;
