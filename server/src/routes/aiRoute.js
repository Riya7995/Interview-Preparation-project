const express = require("express");
const router = express.Router();

const { generateQuestions,generateAnswerFeedback,genrateLearningRoadmap } = require("../controllers/aiController");
const { authentication } = require("../middlewares/auth");

router.post("/generate-questions", authentication, generateQuestions);
router.post("/answer-feedback", authentication, generateAnswerFeedback);
router.post("/learning-roadmap", authentication, genrateLearningRoadmap);


module.exports = router;
