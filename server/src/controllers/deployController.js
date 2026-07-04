const Project = require("../models/Project");
const Deployment = require("../models/Deployment");
const Activity = require("../models/Activity");

// Helper function to simulate background deployment steps
const runSimulatedDeployment = async (deploymentId, projectId, userId) => {
  const steps = [
    { message: "⏳ Initializing deployment runner on Azure Container Instances...", type: "info", delay: 1000 },
    { message: "📥 Pulling latest source code from git repository...", type: "info", delay: 2000 },
    { message: "📦 Restoring package dependencies (npm clean-install)...", type: "info", delay: 2000 },
    { message: "⚙️ Running linter & automated test suites...", type: "info", delay: 2500 },
    { message: "🏗️ Compiling React assets for production bundle...", type: "info", delay: 3000 },
    { message: "🐳 Containerizing application (docker build -t cloudpilot-app:latest)...", type: "info", delay: 2500 },
    { message: "🔒 Logging into Azure Container Registry (acrcloudpilot.azurecr.io)...", type: "info", delay: 1500 },
    { message: "🚀 Pushing container image to Azure Container Registry...", type: "info", delay: 2000 },
    { message: "🌐 Updating Azure App Service configuration & pulling new container...", type: "info", delay: 3000 }
  ];

  try {
    let currentLogs = [];
    let duration = 0;

    // Transition to in_progress
    await Deployment.findByIdAndUpdate(deploymentId, { status: "in_progress" });
    await Activity.create({
      user: userId,
      type: "deployment_started",
      description: `Deployment started for project.`,
      metadata: { projectId, deploymentId }
    });

    for (const step of steps) {
      // Wait for the specified delay
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      duration += Math.round(step.delay / 1000);

      // Append log
      await Deployment.findByIdAndUpdate(
        deploymentId,
        {
          $push: { logs: { message: step.message, type: step.type, timestamp: new Date() } }
        }
      );
    }

    // Determine success (85% success rate)
    const isSuccess = Math.random() < 0.85;
    
    // Final delay for health check
    await new Promise((resolve) => setTimeout(resolve, 1500));
    duration += 2;

    if (isSuccess) {
      const finalMsg = "✅ Deployment successful! Live URL: https://cloudpilot-app.azurewebsites.net";
      await Deployment.findByIdAndUpdate(deploymentId, {
        status: "success",
        duration,
        $push: { logs: { message: finalMsg, type: "success", timestamp: new Date() } }
      });

      const project = await Project.findById(projectId);
      await Activity.create({
        user: userId,
        type: "deployment_success",
        description: `Deployment completed successfully for project "${project ? project.name : 'Unknown'}".`,
        metadata: { projectId, deploymentId }
      });
    } else {
      const failMsg = "❌ Deployment failed! Health check timed out. Pulling container logs for details...";
      const errorDetails = "❌ Error: Docker runtime container exited with status code 139 (Segment Fault). Rollback initiated.";
      await Deployment.findByIdAndUpdate(deploymentId, {
        status: "failed",
        duration,
        $push: { 
          logs: [
            { message: failMsg, type: "warning", timestamp: new Date() },
            { message: errorDetails, type: "error", timestamp: new Date() }
          ]
        }
      });

      const project = await Project.findById(projectId);
      await Activity.create({
        user: userId,
        type: "deployment_failed",
        description: `Deployment failed for project "${project ? project.name : 'Unknown'}".`,
        metadata: { projectId, deploymentId }
      });
    }
  } catch (error) {
    console.error("Simulation deployment runner failed:", error);
    await Deployment.findByIdAndUpdate(deploymentId, {
      status: "failed",
      $push: { logs: { message: `❌ Critical runner failure: ${error.message}`, type: "error", timestamp: new Date() } }
    });
  }
};

/**
 * @desc    Trigger a simulated deployment
 * @route   POST /api/deploy
 * @access  Private
 */
const triggerDeployment = async (req, res) => {
  try {
    const { projectId, commitHash } = req.body;

    if (!projectId) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a projectId"
      });
    }

    const project = await Project.findOne({ _id: projectId, user: req.user._id });
    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found or unauthorized"
      });
    }

    // Create initial deployment record
    const hash = commitHash || Math.random().toString(16).substring(2, 9);
    const deployment = await Deployment.create({
      project: projectId,
      status: "queued",
      commitHash: hash,
      triggeredBy: req.user._id,
      logs: [
        {
          message: `🚀 Queued deployment for commit hash [${hash}]...`,
          type: "info",
          timestamp: new Date()
        }
      ]
    });

    // Run simulation asynchronously in the background
    runSimulatedDeployment(deployment._id, projectId, req.user._id);

    res.status(202).json({
      status: "success",
      message: "Deployment triggered successfully and running in background",
      data: deployment
    });
  } catch (error) {
    console.error("Trigger Deployment Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while triggering deployment"
    });
  }
};

/**
 * @desc    Get deployment history for all user projects
 * @route   GET /api/deploy/history
 * @access  Private
 */
const getDeploymentHistory = async (req, res) => {
  try {
    // 1. Fetch user's projects
    const userProjects = await Project.find({ user: req.user._id }).select("_id");
    const projectIds = userProjects.map((p) => p._id);

    // 2. Fetch deployments for these projects
    const deployments = await Deployment.find({ project: { $in: projectIds } })
      .populate("project", "name gitRepository")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: deployments.length,
      data: deployments
    });
  } catch (error) {
    console.error("Get Deploy History Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching deployment history"
    });
  }
};

/**
 * @desc    Get detailed status & logs for a specific deployment
 * @route   GET /api/deploy/:id
 * @access  Private
 */
const getDeploymentById = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id)
      .populate("project", "name user gitRepository");

    if (!deployment) {
      return res.status(404).json({
        status: "fail",
        message: "Deployment not found"
      });
    }

    // Verify ownership
    if (deployment.project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized to view this deployment"
      });
    }

    res.status(200).json({
      status: "success",
      data: deployment
    });
  } catch (error) {
    console.error("Get Deployment Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching deployment status"
    });
  }
};

module.exports = {
  triggerDeployment,
  getDeploymentHistory,
  getDeploymentById
};
