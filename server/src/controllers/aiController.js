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

module.exports = {
  generateQuestions,
};
