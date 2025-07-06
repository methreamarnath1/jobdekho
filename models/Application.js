const { application } = require("express");
const mongoose = require("mongoose");

// application schema

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId, // reference to the job which you selected to apply
      ref: "Job",
      required: true,
    },
    applicat: {
      type: mongoose.Schema.Types.ObjectId, // reference to the user who applied for the job
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String, // cover letter for the job application
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "revie4wing", "accepted", "rejected"], // status of the application
      default: "pending", // default status is pending
    },
  },
  { timestamps: true }
);

//prevent the dublicate application for the same job by the same user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
