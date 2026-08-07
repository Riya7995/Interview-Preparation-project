const CategoryModel = require("../models/categoryModel");

//create category
const createCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    // Check required fields
    if (!categoryName || !description) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json({
        msg: "Category already exists",
      });
    }

    // Create category
    const category = await CategoryModel.create({
      categoryName,
      description,
    });

    return res.status(201).json({
      msg: "Category created successfully",
      category,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
//get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    if(categories.length === 0) {
      return res.status(404).json({
        msg: "No categories found",
      });
    }
    return res.status(200).json({
      msg: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
//get category by id
const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        msg: "Category not found",
      });
    }

    return res.status(200).json({
      msg: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
//update category
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, description, isActive } = req.body;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        msg: "Category not found",
      });
    }

    if (categoryName) {
      category.categoryName = categoryName;
    }

    if (description) {
      category.description = description;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    // await category.save();
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        description,
        isActive
      },
      { new: true }
    );

    return res.status(200).json({
      msg: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await CategoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        msg: "Category not found",
      });
    }

    return res.status(200).json({
      msg: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};