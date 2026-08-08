const express = require("express");
const router = express.Router();

const { authentication, authorization } = require("../middlewares/auth");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
//admin routes
router.post("/create-category", authentication, authorization, createCategory);
router.put(
  "/update-category/:id",
  authentication,
  authorization,
  updateCategory,
);
router.delete(
  "/delete-category/:id",
  authentication,
  authorization,
  deleteCategory,
);

//user routes
router.get("/get-categories", authentication, getAllCategories);
router.get("/get-category/:id", authentication, getCategoryById);

module.exports = router;
