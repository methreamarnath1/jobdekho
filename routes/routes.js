// import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// const router = express.Router();

// // Get user profile
// router.get("/profile", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     const user = await User.findById(decoded.id).select("-password"); // Exclude password from the user object

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json({
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token." });
//   }
// });

// // Update user profile
// router.put("/profile", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Update user profile
//     const { firstName, lastName, email, role } = req.body;
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.email = email || user.email;
//     user.role = role || user.role;

//     await user.save();

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Delete user account
// router.delete("/profile", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Soft delete user
//     user.isDeleted = true;
//     await user.save();

//     res.status(200).json({ message: "User account deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Get all users (Admin only)
// router.get("/all", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     if (decoded.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied. Insufficient permissions." });
//     }

//     const users = await User.find({ isDeleted: false }).select("-password"); // Exclude password from the user object
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Get user by ID (Admin only)
// router.get("/:id", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     if (decoded.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied. Insufficient permissions." });
//     }

//     const user = await User.findById(req.params.id).select("-password"); // Exclude password from the user object
//     if (!user || user.isDeleted) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Update user by ID (Admin only)
// router.put("/:id", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     if (decoded.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied. Insufficient permissions." });
//     }

//     const user = await User.findById(req.params.id);
//     if (!user || user.isDeleted) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Update user details
//     const { firstName, lastName, email, role } = req.body;
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.email = email || user.email;
//     user.role = role || user.role;

//     await user.save();

//     res.status(200).json({
//       message: "User updated successfully",
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Delete user by ID (Admin only)
// router.delete("/:id", async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     if (decoded.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied. Insufficient permissions." });
//     }

//     const user = await User.findById(req.params.id);
//     if (!user || user.isDeleted) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Soft delete user
//     user.isDeleted = true;
//     await user.save();

//     res.status(200).json({ message: "User account deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// The final phase: ADMIN MANAGEMENT CRUD where admins can:

// Manage all users

// Manage all jobs

// View all applications

// Get dashboard statistics

// Activate/deactivate accounts HOW TO ADD THIS TO MY CODE 