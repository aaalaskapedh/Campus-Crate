const jwt = require("jsonwebtoken");

/**
 * Creates a signed JWT containing the user's id and role.
 * We keep the payload minimal - just enough to identify and authorize the user.
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

module.exports = generateToken;
