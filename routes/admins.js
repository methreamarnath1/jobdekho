// ADMIN MANAGEMENT CRUD where admins can:

// Manage all users

// Manage all jobs

// View all applications

// Get dashboard statistics

// Activate/deactivate accounts HOW TO ADD THIS TO MY CODE

const express = require("express");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// Get dashboard statistics
router.get("/dashboard", auth, authorize("admin"), async (req, res) => {
  try {
    const userCount = await User.countDocuments({ isDeleted: false });
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    res.json({ userCount, jobCount, applicationCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Manage all users
router.get("/users", auth, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Activate/deactivate user accounts
router.put(
  "/users/:id/activate",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { inActive: false },
        { new: true }
      );
      res.json({ message: "User activated", user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/users/:id/deactivate",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { inActive: true },
        { new: true }
      );
      res.json({ message: "User deactivated", user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Manage all jobs
router.get("/jobs", auth, authorize("admin"), async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// View all applications
router.get("/applications", auth, authorize("admin"), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title company")
      .populate("applicant", "firstName lastName email");
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
