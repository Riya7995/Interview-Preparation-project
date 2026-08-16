const InterviewModel = require("../models/interviewModel");
const CategoryModel = require("../models/categoryModel");
const { isValid, isValidObjectId } = require("../utils/validator");

// Add Interview (Admin)
const addInterview = async (req, res) => {
  try {
    let interviewData = req.body;

    if (!interviewData || Object.keys(interviewData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { title, categoryId, difficulty, duration, description, isActive } =
      interviewData;

    // Title Validation
    if (!isValid(title)) {
      return res.status(400).json({ msg: "Interview Title is Required" });
    }

    // CategoryId Validation
    if( !isValid(categoryId)) {
      return res.status(400).json({ msg: "Category Id is Required" });
    }
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ msg: "Invalid Category Id" });
    }

    let category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category Not Found" });
    }

    // Difficulty Validation
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

    // Duration Validation
    if (!isValid(duration)) {
      return res.status(400).json({ msg: "Duration is Required" });
    }

    if (duration <= 0) {
      return res.status(400).json({ msg: "Invalid Duration" });
    }

    // Description Validation
    if (!isValid(description)) {
      return res.status(400).json({ msg: "Description is Required" });
    }

    if (description.length < 10 || description.length > 400) {
      return res.status(400).json({
        msg: "Description Should be less than 400 and greater than 10 Characters.",
      });
    }

    // Interview Status Validation
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({ msg: "Invalid Interview Status" });
    }

    let interview = await InterviewModel.create(interviewData);
    return res
      .status(201)
      .json({ msg: "Interview Added Successfully", interview });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


// Get All Interviews (Search, filter and Pagination)
const getAllInterviews = async (req, res) => {
  try {
    let { search, categoryId, difficulty, page = 1, limit = 5 } = req.query;

    page = Number(page);
    limit = Number(limit);

    // Pagination
    if (page < 1) {
      return res.status(400).json({ msg: "Page must be greater than 0" });
    }

    if (limit < 1 || limit > 20) {
      return res.status(400).json({ msg: "Limit must be between 1 and 20" });
    }

    let filter = {};
    // Search By Title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter By Category
    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({
          msg: "Invalid Category Id",
        });
      }
      filter.categoryId = categoryId;
    }

    // Filter By Difficulty
    if (difficulty) {
      if (
        difficulty !== "easy" &&
        difficulty !== "medium" &&
        difficulty !== "hard"
      ) {
        return res.status(400).json({ msg: "Invalid Difficulty" });
      }

      filter.difficulty = difficulty;
    }

    // Total Interviews
    let totalInterviews = await InterviewModel.countDocuments(filter);

    // Skip Calculation
    let skip = (page - 1) * limit;

    let interviews = await InterviewModel.find(filter)
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (interviews.length === 0) {
      return res.status(404).json({ msg: "No Interview Found" });
    }
    let totalPages = Math.ceil(totalInterviews/limit);

    return res
      .status(200)
      .json({ msg: "Interviews Fetched Successfully",page,limit,totalInterviews,totalPages, interviews });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get Interview By Id
const getInterviewById = async (req, res) => {
  try {
    let interviewId = req.params.id;

    if (!isValidObjectId(interviewId)) {
      return res.status(400).json({ msg: "Invalid Interview Id" });
    }

    let interview =
      await InterviewModel.findById(interviewId).populate("categoryId");

    if (!interview) {
      return res.status(404).json({ msg: "Interview Not Found" });
    }

    return res.status(200).json({ interview });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update Interview (Admin)
const updateInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    if (!isValidObjectId(interviewId)) {
      return res.status(400).json({ msg: "Invalid Interview Id" });
    }
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    const { title, categoryId, difficulty, duration, description, isActive } =
      updateData;
    // Title Validation
    if (title !== undefined) {
      if (!isValid(title)) {
        return res.status(400).json({ msg: "Interview Title is Required" });
      }
      updateData.title = title;
    }
    // CategoryId Validation
    if (categoryId !== undefined) {
      if( !isValid(categoryId)) {
        return res.status(400).json({ msg: "Category Id is Required" });
      }
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({ msg: "Invalid Category Id" });
      }
      let category = await CategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ msg: "Category Not Found" });
      }
      updateData.categoryId = categoryId;
    }
    // Difficulty Validation
    if (difficulty !== undefined) {
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
      updateData.difficulty = difficulty;
    }
    // Duration Validation
    if (duration !== undefined) {
      if (!isValid(duration)) {
        return res.status(400).json({ msg: "Duration is Required" });
      }
      if (duration <= 0) {
        return res.status(400).json({ msg: "Invalid Duration" });
      }
      updateData.duration = duration;
    }
    // Description Validation
    if (description !== undefined) {
      if (!isValid(description)) {
        return res.status(400).json({ msg: "Description is Required" });
      }
      if (description.length < 10 || description.length > 400) {
        return res.status(400).json({
          msg: "Description Should be less than 400 and greater than 10 Characters.",
        });
      }
      updateData.description = description;
    }
    // Interview Status Validation
    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ msg: "Invalid Interview Status" });
      }
      updateData.isActive = isActive;
    }

    let updatedInterview = await InterviewModel.findByIdAndUpdate(
      interviewId,
      updateData,
      { new: true },
    );

    if (!updatedInterview) {
      return res.status(404).json({ msg: "Interview Not Found" });
    }

    return res
      .status(200)
      .json({
        msg: "Interview Updated Successfully",
        interview: updatedInterview,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Interview (Admin)
const deleteInterview = async (req, res) => {
  try {
    let interviewId = req.params.id;

    if (!isValidObjectId(interviewId)) {
      return res.status(400).json({ msg: "Invalid Interview Id" });
    }

    let deletedInterview = await InterviewModel.findByIdAndDelete(interviewId);

    if (!deletedInterview) {
      return res
        .status(404)
        .json({ msg: "Interview Not Found Or already deleted" });
    }

    return res.status(200).json({ msg: "Interview Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};


