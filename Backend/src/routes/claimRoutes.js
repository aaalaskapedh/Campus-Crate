const express = require("express");
const {
  createClaim,
  getClaimsForItem,
  updateClaimStatus,
} = require("../controllers/claimController");
const verifyJWT = require("../middleware/auth");

const router = express.Router();

router.use(verifyJWT); // every route below requires login

router.post("/", createClaim);
router.get("/item/:itemId", getClaimsForItem);
router.patch("/:id", updateClaimStatus);

module.exports = router;
