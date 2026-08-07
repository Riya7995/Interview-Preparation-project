const express = require("express");
const router = express.Router();
const { authentication, authorization } = require("../middlewares/auth");
const {
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/get", authentication, getProfile);
router.put("/update", authentication, updateProfile);
router.delete("/delete", authentication, deleteProfile);

//Admin Routes
router.get("/getall", authentication, authorization, getAllUsers);
router.delete("/delete/:id", authentication, authorization, deleteUser);
module.exports = router;
