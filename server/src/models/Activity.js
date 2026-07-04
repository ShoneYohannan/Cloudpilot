const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        "project_created",
        "project_updated",
        "project_deleted",
        "deployment_started",
        "deployment_success",
        "deployment_failed"
      ]
    },
    description: {
      type: String,
      required: true
    },
    metadata: {
      projectId: mongoose.Schema.Types.ObjectId,
      projectName: String,
      deploymentId: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
