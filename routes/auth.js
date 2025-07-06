const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//Register

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastName, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Message: "user alredy exists" });
    }
    //create User
    const user = new User({
      firstName: firstname,
      lastName: lastName,
      email,
      password,
      role,
    });

    await user.save();
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWTSECRET,
      { expiresIn: "30d" } // Token expires in 30 days
    );
    res.status(201).json({
      message: "user registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWTSECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// Export the router
module.exports = router;
