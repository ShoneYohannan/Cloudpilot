const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email and password"
      });
    }

    // 2. Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid email address"
      });
    }

    // 3. Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters"
      });
    }

    // 4. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists with this email"
      });
    }

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Invalid user data"
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred during registration"
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password"
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Compare password
    if (user && (await user.comparePassword(password))) {
      res.status(200).json({
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password"
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred during login"
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      status: "success",
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      }
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching profile"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
