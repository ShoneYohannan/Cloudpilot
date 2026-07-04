const Project = require("../models/Project");
const Activity = require("../models/Activity");

/**
 * @desc    Get all projects for the logged-in user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects
    });
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching projects"
    });
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found or unauthorized"
      });
    }

    res.status(200).json({
      status: "success",
      data: project
    });
  } catch (error) {
    console.error("Get Project Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching the project"
    });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res) => {
  try {
    const { name, description, gitRepository } = req.body;

    if (!name || !gitRepository) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a project name and Git repository URL"
      });
    }

    const project = await Project.create({
      name,
      description,
      gitRepository,
      user: req.user._id
    });

    // Create log activity
    await Activity.create({
      user: req.user._id,
      type: "project_created",
      description: `Project "${name}" was created successfully.`,
      metadata: {
        projectId: project._id,
        projectName: project.name
      }
    });

    res.status(201).json({
      status: "success",
      data: project
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while creating the project"
    });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res) => {
  try {
    const { name, description, gitRepository, status } = req.body;

    let project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found or unauthorized"
      });
    }

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.gitRepository = gitRepository || project.gitRepository;
    project.status = status || project.status;

    const updatedProject = await project.save();

    // Create log activity
    await Activity.create({
      user: req.user._id,
      type: "project_updated",
      description: `Project "${project.name}" details were updated.`,
      metadata: {
        projectId: project._id,
        projectName: project.name
      }
    });

    res.status(200).json({
      status: "success",
      data: updatedProject
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while updating the project"
    });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found or unauthorized"
      });
    }

    await Project.deleteOne({ _id: req.params.id });

    // Create log activity
    await Activity.create({
      user: req.user._id,
      type: "project_deleted",
      description: `Project "${project.name}" was deleted.`,
      metadata: {
        projectId: project._id,
        projectName: project.name
      }
    });

    res.status(200).json({
      status: "success",
      message: "Project removed successfully"
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error occurred while deleting the project"
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
