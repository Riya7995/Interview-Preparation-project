const ai = require("../config/gemini");

const { isValid } = require("../utils/validator");

//Generate Interview Questions using AI
const generateQuestions = async (req, res) => {
  try {
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { category, difficulty, noOfQuestions } = data;

    if (!isValid(category)) {
      return res.status(400).json({ msg: "Category is Required" });
    }

    if (!isValid(difficulty)) {
      return res.status(400).json({ msg: "Difficulty is Required" });
    }

    if (
      difficulty !== "easy" &&
      difficulty !== "medium" &&
      difficulty !== "hard"
    ) {
      return res.status(400).json({ msg: "Invalid Difficulty " });
    }

    if (!isValid(noOfQuestions)) {
      return res.status(400).json({ msg: "No. Of Questions is Required" });
    }

    if (noOfQuestions < 1 || noOfQuestions > 10) {
      return res
        .status(400)
        .json({ msg: "Number Of Questions must be between 1 and 10" });
    }

    const prompt = `
    You are an expert technical interviewer.
    
    Generate ${noOfQuestions} interview questions for ${category}.

    Difficulty Level: ${difficulty}

    Rules:
    1. Questions should be relevant to the given category.
    2. Questions should match the difficulty level.
    3. Do not provide answers.
    4. Return only valid JSON.
    5. Use this format:

    [
     {
        "question":"Question here",
        "type":"technical"
     }
    ]
    `;

    let response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let result = response.text;
      let questions = JSON.parse(result);
return res.status(201).json({msg:"question generted succesfully",questions});
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
// Generate Ideal Answer + Improvement
const generateAnswerFeedback = async (req, res) => {
  try {
    let data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { question, answer } = data;

    if (!isValid(question)) {
      return res.status(400).json({ msg: "Question is Required" });
    }

    if (!isValid(answer)) {
      return res.status(400).json({ msg: "Answer is Required" });
    }

    let prompt = `
    You are an expert technical interviewer.

    Analyze the following interview question and candidate answer.

    Question:
    ${question}

    Candidate Answer:
    ${answer}

    Generate:
    1. An ideal answer
    2. Improvement suggestions

    Rules:
    1. Keep the ideal answer technically correct.
    2. Improvement suggestions should be practical.
    3. Do not give unnecessary information.
    4. Return only valid JSON.

    Use exactly this format:

    {
      "idealAnswer": "Ideal answer here",
      "improvementSuggestions": [
        "Suggestion 1",
        "Suggestion 2",
        "Suggestion 3"
      ]
    }
    `;

    let response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let result = response.text;
    let feedback = JSON.parse(result);

    return res.status(200).json({ msg: "Answer Feedback Generated", feedback });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Personalised Learning Roadmap
const genrateLearningRoadmap = async (req, res) => {
  try {
    let data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { category, difficulty, score, feedback } = data;

    if (!isValid(category)) {
      return res.status(400).json({ msg: "Category is Required" });
    }

    if (!isValid(difficulty)) {
      return res.status(400).json({ msg: "Difficulty is Required" });
    }
    if (
      difficulty !== "easy" &&
      difficulty !== "medium" &&
      difficulty !== "hard"
    ) {
      return res.status(400).json({ msg: "Invalid Difficulty " });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({ msg: "Score is Required" });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({ msg: "Score must be between 0 and 100" });
    }

    if (!isValid(feedback)) {
      return res.status(400).json({ msg: "Feedback is Required" });
    }

    let prompt = `
      You are an expert technical mentor.

      Create a personalized learning roadmap for a candidate based on their interview performance.

      Category:
      ${category}

      Difficulty:
      ${difficulty}

      Score:
      ${score}/100

      Interview Feedback:
      ${feedback}

      Create a practical learning roadmap.

      Rules:
      1. Identify weak areas from the feedback.
      2. Suggest topics the candidate should study.
      3. Suggest practical exercises.
      4. Arrange the roadmap in a logical order.
      5. Keep it beginner-friendly and practical.
      6. Return only valid JSON.

      Use exactly this format:

      {
        "summary": "Short performance summary",
        "weakAreas": [
          "Weak area 1",
          "Weak area 2"
        ],
        "roadmap": [
          {
            "step": 1,
            "topic": "Topic name",
            "description": "What to learn",
            "practice": "What to practice"
          },
          {
            "step": 2,
            "topic": "Topic name",
            "description": "What to learn",
            "practice": "What to practice"
          }
        ]
      }
      `;

    let response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let result = response.text;

    let roadmap = JSON.parse(result);

    return res.status(200).json({ msg: "Learning Roadmap Generated", roadmap });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  generateQuestions,
  generateAnswerFeedback,
  genrateLearningRoadmap,
};

