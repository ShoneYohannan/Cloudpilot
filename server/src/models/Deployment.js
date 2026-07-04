const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    status: {
      type: String,
      enum: ["queued", "in_progress", "success", "failed"],
      default: "queued"
    },
    logs: [
      {
        timestamp: {
          type: Date,
          default: Date.now
        },
        message: String,
        type: {
          type: String,
          enum: ["info", "warning", "error", "success"],
          default: "info"
        }
      }
    ],
    duration: {
      type: Number, // in seconds
      default: 0
    },
    commitHash: {
      type: String,
      default: "HEAD"
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Deployment = mongoose.model("Deployment", deploymentSchema);

module.exports = Deployment;
