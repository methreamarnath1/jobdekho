const User = require("../models/User");

exports.getProfile = async (req, res) => {
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
};
exports.updateProfile = async (req, res) => {
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
};

exports.addSkill = async (req, res) => {
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
};
exports.removeSkill = async (req, res) => {
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
};
exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.error(error);
  }
};
