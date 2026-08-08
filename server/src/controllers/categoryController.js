const CategoryModel = require("../models/categoryModel");
const { isValid, isValidCategoryName } = require("../utils/validator");
//create category (admin)
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
  
    if (!categoryData || Object.keys(categoryData).length === 0) {
      return res.status(400).json({
        msg: "Bad Request! No Data Provided",
      });
    }
    const { categoryName, description, status } = categoryData;
    // Category Name Validation
    if (!isValid(categoryName)) {
      return res.status(400).json({
        msg: "Category name is required",
      });
    }
    if (!isValidCategoryName(categoryName)) {
      return res.status(400).json({
        msg: "Invalid category name. Only alphabets and spaces are allowed.",
      });
    }
    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json({
        msg: "Category already exists",
      });
    }
    //description validation
    if (!isValid(description)) {
      return res.status(400).json({
        msg: "Description is required",
      });
    }
    if (description.length < 10 || description.length > 400) {
      return res.status(400).json({
        msg: "Description Should be less than 400 and greater than 10 Characters.",
      });
    }
    //status validation
    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ msg: "Invalid Status" });
      }
    }
    // Create category
    const category = await CategoryModel.create(categoryData);

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

    if (categories.length === 0) {
      return res.status(404).json({
        msg: "No categories found",
      });
    }
    return res.status(200).json({
      msg: "Categories fetched successfully",
        categoryCount: categories.length,
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
    const categoryId = req.params.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        msg: "Invalid Category Id",
      });
    }
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
//update category(admin)
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        msg: "Invalid Category Id",
      });
    }
    const categoryData = req.body;


    if (!categoryData || Object.keys(categoryData).length === 0) {
      return res.status(400).json({
        msg: "Bad Request! No Data Provided",
      });
    }
    const { categoryName, description, status } = categoryData;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        msg: "Category not found",
      });
    }
    //category name validation
    if (categoryName) {
      if (!isValid(categoryName)) {
        return res.status(400).json({
          msg: "Invalid category name. Only alphabets and spaces are allowed.",
        });
      }
      if (!isValidCategoryName(categoryName)) {
        return res.status(400).json({
          msg: " ValidCategory name is required",
        });
      }
       let duplicateCategory = await CategoryModel.findOne({
        categoryName,
        _id: { $ne: categoryId },
      });

      if (duplicateCategory) {
        return res.status(400).json({
          msg: "Category Already Exists",
        });
      }
      category.categoryName = categoryName;
    }
    //description validation
    if (description) {
      if (!isValid(description)) {
        return res.status(400).json({
          msg: "Description is required",
        });
      }
      if (description.length < 10 || description.length > 400) {
        return res.status(400).json({
          msg: "Description Should be less than 400 and greater than 10 Characters.",
        });
      }
      category.description = description;
    }
  
    //status validation
    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ msg: "Invalid Status" });
      }
      category.status = status;
    }

    // await category.save();
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      categoryData,
      { new: true },
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

}
//delete category(admin)
const deleteCategory = async (req, res) => {
  try {
    const  categoryId= req.params.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        msg: "Invalid Category Id",
      });
    }

    const category = await CategoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        msg: "Category not found or already deleted",
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
  deleteCategory,
};
