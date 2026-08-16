const AttemptModel = require("../models/attemptModel");
const InterviewModel = require("../models/interviewModel");
const ai = require("../config/gemini")

const { isValidObjectId, isValid } = require("../utils/validator");

// Start Interview
const startInterview = async (req, res) => {
  try {
    let interviewId = req.params.interviewId;
    if (!isValidObjectId(interviewId)) {
      return res.status(400).json({ msg: "Invalid Interview Id" });
    }

    let interview = await InterviewModel.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ msg: "Interview Not Found" });
    }

    if (!interview.isActive) {
      return res.status(400).json({ msg: "Interview is not active" });
    }

    let attempt = await AttemptModel.create({
      userId: req.userId,
      interviewId: interviewId,
      questions: [],
      status: "started",
    });

    res.status(201).json({ msg: "Interview Started Successfully", attempt });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Add Questions to Attempt
const addQuestionsToAttempt = async (req, res) => {
  try {
    let attemptId = req.params.attemptId;
    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({ msg: "Invalid Attempt Id" });
    }

    let { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ msg: "Question are Required" });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        msg: "At Least One question is Required",
      });
    }

    let attempt = await AttemptModel.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ msg: "Attempt Not Found" });
    }

    if (attempt.userId.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You can access Only your own attempt." });
    }

    if (attempt.status === "completed") {
      return res.status(400).json({ msg: "Interview already completed" });
    }

    attempt.questions = questions;

    await attempt.save();

    return res
      .status(200)
      .json({ msg: "Questions added Successfully", attempt });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Submit Answers
const submitAnswer = async (req, res) => {
  try {
    let attemptId = req.params.attemptId;
    let questionId = req.params.questionId;

    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({ msg: "Invalid Attempt Id" });
    }

    if (!isValidObjectId(questionId)) {
      return res.status(400).json({ msg: "Invalid Question Id" });
    }

    let { answer } = req.body;

    if (!isValid(answer)) {
      return res.status(400).json({ msg: "Answers is Required" });
    }

    let attempt = await AttemptModel.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ msg: "Attempt Not Found" });
    }

    if (attempt.userId.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You can access Only your own attempt." });
    }

    if (attempt.status === "completed") {
      return res.status(400).json({ msg: "Interview already completed" });
    }

    let question = attempt.questions.id(questionId);

    if (!question) {
      return res.status(404).json({ msg: "Question Not Found" });
    }

    question.answer = answer;
    await attempt.save();

    return res.status(200).json({ msg: "Answer Submitted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
// Complete Interview and Evaluate Using AI
const completeInterview = async (req, res) => {
  try {
    let attemptId = req.params.attemptId;

    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({ msg: "Invalid Attempt Id" });
    }

    let attempt = await AttemptModel.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ msg: "Attempt Not Found" });
    }

    if (attempt.userId.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You can access Only your own attempt." });
    }

    if (attempt.status === "completed") {
      return res.status(400).json({ msg: "Interview already completed" });
    }

    if (!attempt.questions || attempt.questions.length === 0) {
      return res.status(400).json({ msg: "No Question Found" });
    }

    for (let question of attempt.questions) {
      if (!isValid(question.answer)) {
        return res.status(400).json({
          msg: "Please Answer all Questions Before Completing Interview.",
        });
      }
    }

    let interviewData = attempt.questions.map((question, index) => {
      return {
        questionNumber: index + 1,
        question: question.question,
        answer: question.answer,
      };
    });

    let prompt = `
    You are an expert technical interviewer.

    Evaluate the candidate's complete interview.

    Questions and Candidate Answers:

    ${JSON.stringify(interviewData, null, 2)}

    Evaluate the candidate based on:

    1. Technical Correctness
    2. Understanding Of Concepts
    3. Relevance
    4. Completeness
    5. Overall Quality

    Give an Overall score between 0 and 100.

    Also provide useful feedback covering:
    - Strengths
    - Weaknesses
    - Areas for Improvement
    
    Return ONLY valid  JSON in this exact format:

    {
      "score":85,
      "feedback":"Overall feedback here"
    }

    Rules:
    - Score must be between 0 and 100.
    - Feedback should be clear and useful.
    - Do not use markdown.
    - Do not add any extra text.
    `;

    let response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let result = response.text;

    let evaluation = JSON.parse(result);

    if (evaluation.score === undefined || evaluation.feedback === undefined) {
      return res.status(400).json({ msg: "Invalid AI Response" });
    }

    if (
      typeof evaluation.score !== "number" ||
      evaluation.score < 0 ||
      evaluation.score > 100
    ) {
      return res.status(400).json({ msg: "Invalid AI Score" });
    }

    // Save Final Result
    attempt.score = evaluation.score;
    attempt.feedback = evaluation.feedback;
    attempt.status = "completed";

    await attempt.save();

    return res.status(200).json({
      msg: "Interview Completed",
      result: {
        score: attempt.score,
        feedback: attempt.feedback,
        status: attempt.status,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My All Attempts
const getMyAttempts = async (req, res) => {
  try {
    let attempts = await AttemptModel.find({ userId: req.user.userId })
      .populate("interviewId", "title description category difficulty")
      .sort({ createdAt: -1 });

    if (attempts.length === 0) {
      return res.status(404).json({ msg: "No Attempts Found" });
    }

    return res
      .status(200)
      .json({ msg: "Attempts Fetched Successfully", attempts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Single Attempt
const getSingleAttempt = async (req, res) => {
  try {
    let attemptId = req.params.attemptId;
    if (!isValidObjectId(attemptId)) {
      return res.status(400).json({ msg: "Invalid Attempt Id" });
    }

    let attempt = await AttemptModel.findById(attemptId).populate(
      "interviewId",
      "title description category difficulty",
    );

    if (!attempt) {
      return res.status(404).json({ msg: "Attempt Not Found" });
    }

    if (attempt.userId.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ msg: "You can access Only your own attempt." });
    }
    return res
      .status(200)
      .json({ msg: "Attempt Fetched Successfully", attempt });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
// Get My Performance Analytics
const getMyAnalytics = async (req, res) => {
  try {
    let userId = req.userId;

    // Total Attempts
    const totalAttempts = await AttemptModel.countDocuments({ userId });

    if (totalAttempts === 0) {
      return res.status(404).json({ msg: "No Attempts Found" });
    }

    // Completed Attempts
    const completedAttempts = await AttemptModel.countDocuments({
      userId,
      status: "completed",
    });

    // Pending Attempts
    const pendingAttempts = totalAttempts - completedAttempts;

    // Completed Attempts Data
    const attempts = await AttemptModel.find({ userId, status: "completed" });

    let totalScore = 0;

    attempts.forEach((attempt) => {
      totalScore += attempt.score || 0;
    });

    let averageScore = 0;

    if (completedAttempts > 0) {
      averageScore = totalScore / completedAttempts;
      averageScore = Number(averageScore.toFixed(2));
    }

    return res.status(200).json({
      msg: "Performance Analytics Fetched",
      analytics: {
        totalAttempts,
        completedAttempts,
        pendingAttempts,
        totalScore,
        averageScore,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  startInterview,
  addQuestionsToAttempt,
  submitAnswer,
  completeInterview,
  getMyAttempts,
  getSingleAttempt,
  getMyAnalytics
};
