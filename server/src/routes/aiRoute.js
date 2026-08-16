const express = require("express");
const router = express.Router();

const { generateQuestions } = require("../controllers/aiController");
const { authentication } = require("../middlewares/auth");

router.post("/generate-questions", authentication, generateQuestions);

module.exports = router;
