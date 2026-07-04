const Project = require("../models/Project");
const Deployment = require("../models/Deployment");
const Activity = require("../models/Activity");

/**
 * @desc    Get dashboard stats and recent activities for the user
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    // 1. Fetch user's projects
    const projects = await Project.find({ user: req.user._id }).select("_id");
    const projectIds = projects.map((p) => p._id);

    // 2. Count statistics
    const totalProjects = projects.length;

    const totalDeployments = await Deployment.countDocuments({
      project: { $in: projectIds }
    });

    const successfulDeployments = await Deployment.countDocuments({
      project: { $in: projectIds },
      status: "success"
    });

    const failedDeployments = await Deployment.countDocuments({
      project: { $in: projectIds },
      status: "failed"
    });

    // 3. Fetch recent activities
    const recentActivities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalProjects,
          totalDeployments,
          successfulDeployments,
          failedDeployments
        },
        recentActivities
      }
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching dashboard statistics"
    });
  }
};

module.exports = {
  getDashboardStats
};
