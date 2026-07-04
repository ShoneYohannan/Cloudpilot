const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const deployRoutes = require("./routes/deployRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "🚀 CloudPilot API is running"
  });
});

// Routes configuration
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deploy", deployRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find route for ${req.method} ${req.originalUrl}`
  });
});

// Global 500 Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;