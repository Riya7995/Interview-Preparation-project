const express = require("express");
const router = express.Router();

const { authentication, authorization } = require("../middlewares/auth");
const { createCategory, getAllCategories,getCategoryById,updateCategory,deleteCategory} = require("../controllers/adminController");


router.post("/create-category", authentication, authorization, createCategory);
router.get("/get-categories", authentication, authorization, getAllCategories);
router.get("/get-category/:id", authentication, authorization, getCategoryById);
router.put("/update-category/:id", authentication, authorization, updateCategory);
router.delete("/delete-category/:id", authentication, authorization, deleteCategory);





module.exports = router;