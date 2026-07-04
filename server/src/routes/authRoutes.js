const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Route: POST /api/auth/register
// Desc:  Register a new user
// Access: Public
router.post("/register", registerUser);

// Route: POST /api/auth/login
// Desc:  Authenticate user and get token
// Access: Public
router.post("/login", loginUser);

// Route: GET /api/auth/profile
// Desc:  Get current user profile
// Access: Private
router.get("/profile", protect, getUserProfile);

module.exports = router;
