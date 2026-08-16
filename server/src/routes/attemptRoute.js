const express = require("express");
const router = express.Router();

const {
  startInterview,
  addQuestionsToAttempt,
  submitAnswer,
  completeInterview,
  getMyAttempts,
  getSingleAttempt,
} = require("../controllers/attemptController");

const { authentication } = require("../middlewares/auth");

router.post("/start-interview/:interviewId", authentication, startInterview);
router.post("/:attemptId/questions", authentication, addQuestionsToAttempt);
router.put(
  "/:attemptId/question/:questionId/answer",
  authentication,
  submitAnswer,
);
router.post("/:attemptId/complete", authentication, completeInterview);

router.get("/my-attempts", authentication, getMyAttempts);
router.get("/:attemptId", authentication, getSingleAttempt);

module.exports = router;
