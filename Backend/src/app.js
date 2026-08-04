const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --- Global middleware (runs on every request) ---
app.use(
  cors({
    origin: process.env.CLIENT_URL, // only allow our React app to call this API
    credentials: true,
  })
);
app.use(express.json()); // parses incoming JSON request bodies into req.body
app.use(cookieParser());

// --- Health check (useful for confirming deployment worked) ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- Feature routes ---
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/admin", adminRoutes);

// --- 404 handler for unknown routes ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Centralized error handler (must be LAST) ---
app.use(errorHandler);

module.exports = app;
