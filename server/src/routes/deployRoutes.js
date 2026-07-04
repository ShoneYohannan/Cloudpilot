const express = require("express");
const router = express.Router();
const {
  triggerDeployment,
  getDeploymentHistory,
  getDeploymentById
} = require("../controllers/deployController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected by JWT authentication
router.use(protect);

router.post("/", triggerDeployment);
router.get("/history", getDeploymentHistory);
router.get("/:id", getDeploymentById);

module.exports = router;
