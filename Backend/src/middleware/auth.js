const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protects routes - only lets requests through if they carry a valid JWT.
 * Expects the token in the Authorization header: "Bearer <token>"
 */
async function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the current user to the request, minus the password/sensitive fields
    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    req.user = user; // now every controller after this can read req.user
    next(); // pass control to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
}

module.exports = verifyJWT;
