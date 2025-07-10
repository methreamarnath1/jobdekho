const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "recruiter", "admin"],
    default: "user",
  },
  profile: {
    skills: [String],
    bio: String,
    phone: String,
    resume: String,
  },
  inActive: { type: Boolean, default: false }, // it is used to check if the user is active or not
  isDeleted: { type: Boolean, default: false }, // it is used to soft delete the user
});

// hasing the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bycrypt.genSalt(10); // Generate a salt with 10 rounds and the salt is used to hash the password
    this.password = await bycrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bycrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
