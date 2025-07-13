const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Connect to DB
connectDB();

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admins");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("http://localhost:5000/");
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
