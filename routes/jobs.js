const express = require("express");
const Job = require("../models/Job");
const { auth, authorize } = require("../middleware/auth");
const router = express.Router();

//get all jobs (with filters and pagination)

router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, search, location, jobType, skills } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      filter.jobType = jobType;
    }
    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim());
      filter.skills = { $in: skillsArray };
    }
    const jobs = await Job.find(filter)
      .populate("postedBy", "firstName lastName ")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//get job by id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "firstName lastName"
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//create a job by recruiter only
router.post("/", auth, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      jobType,
      skills,
      experienceLevel,
      salary,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !jobType ||
      !skills ||
      !experienceLevel ||
      !salary
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const job = new Job({
      title,
      description,
      requirements: requirements || [],
      skills: skills || [],

      location,
      jobType,
      skills,
      experienceLevel,
      salary,
      postedBy: req.user.id,
      company: {
        name:
          req.user.company?.name ||
          "${req.user.firstName} ${req.user.lastName}",
        description: req.user.company?.description || "No description provided",
        logo: req.user.company?.logo || "default-logo.png",
      },
    });

    await job.save();
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//update job by id (recruiter or admin)
router.put(
  "/:id",
  auth,
  auth,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      }

      // Check if the user is authorized to update the job
      if (
        req.user.role !== "admin" &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message: "You are not authorized to update this job",
          });
      }
      const {
        title,
        description,
        location,
        jobType,
        skills,
        experienceLevel,
        salary,
      } = req.body;

      // Update fields
      if (title) job.title = title;
      if (description) job.description = description;
      if (requirements) job.requirements = requirements;
      if (skills) job.skills = skills;
      if (location) job.location = location;
      if (jobType) job.jobType = jobType;
      if (experienceLevel) job.experienceLevel = experienceLevel;
      if (salary) job.salary = salary;
      if (isActive !== undefined) job.isActive = isActive;

      await job.save();

      res.json({
        success: true,
        message: "Job updated successfully",
        job,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Delete job (recruiters only - own jobs)
router.delete(
  "/:id",
  auth,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // Check if user owns this job (admin can delete any job)
      if (
        req.user.role !== "admin" &&
        job.postedBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own jobs",
        });
      }

      await Job.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// Get jobs posted by logged-in recruiter
router.get(
  "/recruiter/my-jobs",
  auth,
  authorize("recruiter", "admin"),
  async (req, res) => {
    try {
      const jobs = await Job.find({ postedBy: req.user.id }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        jobs,
        count: jobs.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
