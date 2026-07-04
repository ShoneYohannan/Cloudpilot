const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a project name"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    gitRepository: {
      type: String,
      trim: true,
      required: [true, "Please add a Git repository URL"]
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
