const express = require("express");
const User = require("../models/User");
const { auth, authorize } = require("../middleware/auth");
const router = express.Router();

//git current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.error(error);
  }
});

//update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName, profile } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profile) updateData.profile = profile;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.error(error);
  }
});

//Add skills to user profile
router.post("/profile/skills", auth, async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill is required",
      });
    }

    const user = await User.findById(req.user.id);
    if (user.profile.skills.includes(skill)) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    user.profile.skills.push(skill);
    await user.save();

    res.json({
      success: true,
      message: "Skill added successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.error(error);
  }
});
// Remove skill from user profile
router.delete("/skills/:skill", auth, async (req, res) => {
  try {
    const { skill } = req.params;

    const user = await User.findById(req.user.id);
    user.profile.skills = user.profile.skills.filter((s) => s !== skill);
    await user.save();

    res.json({
      success: true,
      message: "Skill removed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.error(error);
  }
});
// Get all users (for admin ,recruiter)
router.get("/:id", auth, authorize("admin", "recruiter"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.error(error);
  }
});

module.exports = router;
