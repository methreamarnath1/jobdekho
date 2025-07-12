const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Apply for a job (users only)
router.post("/", auth, authorize("user"), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Validation
    if (!jobId || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: "Job ID and cover letter are required",
      });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not active",
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume: req.user.profile.resume || "",
    });

    await application.save();

    // Populate the response
    await application.populate([
      { path: "job", select: "title company location" },
      { path: "applicant", select: "firstName lastName email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get user's applications
router.get("/my-applications", auth, authorize("user"), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location jobType salary createdAt")
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get applications for a specific job (recruiters only)
router.get(
  "/job/:jobId",
  auth,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      const { jobId } = req.params;

      // Check if job exists and user has access
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // Check if recruiter owns this job (admin can view any)
      if (
        req.user.role !== "admin" &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only view applications for your own jobs",
        });
      }

      const applications = await Application.find({ job: jobId })
        .populate(
          "applicant",
          "firstName lastName email profile.skills profile.bio profile.phone"
        )
        .sort({ appliedAt: -1 });

      res.json({
        success: true,
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
        },
        applications,
        count: applications.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Get all applications for recruiter's jobs
router.get(
  "/recruiter/all",
  auth,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      // Get all jobs posted by the recruiter
      const jobs = await Job.find({ postedBy: req.user.id }).select("_id");
      const jobIds = jobs.map((job) => job._id);

      const applications = await Application.find({ job: { $in: jobIds } })
        .populate("job", "title company location")
        .populate("applicant", "firstName lastName email profile.skills")
        .sort({ appliedAt: -1 });

      res.json({
        success: true,
        applications,
        count: applications.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Update application status (recruiters only)
router.put(
  "/:id/status",
  auth,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      const { status, notes } = req.body;

      // Validation
      const validStatuses = [
        "pending",
        "reviewed",
        "shortlisted",
        "rejected",
        "hired",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const application = await Application.findById(req.params.id).populate(
        "job",
        "postedBy title"
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Check if recruiter owns this job (admin can update any)
      if (
        req.user.role !== "admin" &&
        application.job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only update applications for your own jobs",
        });
      }

      // Update application
      application.status = status;
      application.reviewedAt = Date.now();
      application.reviewedBy = req.user.id;
      if (notes) application.notes = notes;

      await application.save();

      res.json({
        success: true,
        message: "Application status updated successfully",
        application,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Cancel application (users only)
router.delete("/:id", auth, authorize("user"), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if user owns this application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own applications",
      });
    }

    // Check if application can be cancelled
    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "You can only cancel pending applications",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get single application details
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job", "title company location jobType salary")
      .populate("applicant", "firstName lastName email profile")
      .populate("reviewedBy", "firstName lastName");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check access rights
    const isOwner = application.applicant._id.toString() === req.user.id;
    const isRecruiter =
      req.user.role === "recruiter" &&
      application.job.postedBy?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
