const express = require("express");
const router = express.Router();

const { authentication, authorization } = require("../middlewares/auth");

const {
  addInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

// Admin Routes
router.post("/add-interview", authentication, authorization, addInterview);
router.put("/update/:id", authentication, authorization, updateInterview);
router.delete("/delete/:id", authentication, authorization, deleteInterview);

// User Routes
router.get("/all-interviews", authentication, getAllInterviews);
router.get("/get-interview/:id", authentication, getInterviewById);

module.exports = router;

