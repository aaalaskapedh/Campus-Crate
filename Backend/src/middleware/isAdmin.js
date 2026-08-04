/**
 * Must run AFTER verifyJWT, since it relies on req.user being set.
 * Blocks the request if the logged-in user isn't an admin.
 */
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

module.exports = isAdmin;
