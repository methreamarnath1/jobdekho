const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  getById,
} = require("../controllers/userController");
const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/profile/skills", auth, addSkill);
router.delete("/skills/:skill", auth, removeSkill);
router.get("/:id", auth, authorize("admin", "recruiter"), getById);

module.exports = router;
