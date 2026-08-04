/**
 * Catches any error thrown/passed via next(err) anywhere in the app
 * and sends back a consistent JSON error shape instead of an HTML stack trace.
 * Must be registered LAST in app.js, after all routes.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Mongoose "CastError" usually means a malformed MongoDB ObjectId was passed in a URL
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Mongoose validation errors (e.g. missing required field)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
}

module.exports = errorHandler;
