const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auththentication } = require("../middlewares/auth");

const {
  isValid,
  isValidFullName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidObjectId,
} = require("../utils/validator");

// Signup User
const signupUser = async (req, res) => {
  try {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { fullName, email, password, phone, bio, role } = userData;

    // Full Name Validation
    if (!isValid(fullName)) {
      return res.status(400).json({ msg: "Full Name is Required" });
    }

    if (fullName.length < 2 || !isValidFullName(fullName)) {
      return res.status(400).json({ msg: "Invalid Full Name" });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let duplicateEmail = await UserModel.findOne({ email });

    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    // Phone Validation
    if (!isValid(phone)) {
      return res.status(400).json({ msg: "Phone Number is Required" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ msg: "Invalid Phone Number" });
    }

    let duplicatePhoneNo = await UserModel.findOne({ phone });
    if (duplicatePhoneNo) {
      return res.status(400).json({ msg: "Phone Number Already Exists" });
    }

    // Bio Validation
    if (bio !== undefined) {
      if (bio.trim().length > 200) {
        return res
          .status(400)
          .json({ msg: "Bio Should not exceed 200 Characters." });
      }
    }

    // Role Validation
    if (role !== undefined) {
      if (role !== "user") {
        return res.status(400).json({ msg: "Invalid Role" });
      }
    }

    // Password Hashing
    let hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    let userAdded = await UserModel.create(userData);

    return res.status(201).json({ msg: "Signup Successfully Done", userAdded });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
// Login User
const loginUser = async (req, res) => {
  try {
    let data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }
    const { email, password } = data;
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    let passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
        userRole: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );
    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//Get User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    return res.status(200).json({ msg: "Profile found Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userdata = req.body;
    if (!userdata || Object.keys(userdata).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }
    const { fullName, email, password, phone, bio, profileImage } = userdata;
    let updateData = {};
    //fullname validation
    if (fullName !== undefined) {
      if (!isValid(fullName)) {
        return res.status(400).json({ msg: "Full name is required" });
      }
      if (fullName.length < 2 || !isValidName(fullName)) {
        return res.status(400).json({ msg: "Invalid Name" });
      }
      updateData.fullName = fullName;
    }
    //email validation
    if (email !== undefined) {
      if (!isValid(email)) {
        return res.status(400).json({ msg: "Email is Required" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
      const DuplicateEmail = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });

      if (DuplicateEmail) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      updateData.email = email;
    }
    //password validation
    if (password !== undefined) {
      if (!isValid(password)) {
        return res.status(400).json({ msg: "Password is Required" });
      }
      if (!isValidPassword(password)) {
        return res.status(400).json({
          msg: "Password must be between 8 to 20 characters with uppercase, lowercase, and special character,lowercase,numbers and special characters.",
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }
    //phone validation
    if (phone !== undefined) {
      if (!isValid(phone)) {
        return res.status(400).json({ msg: "Phone Number is Required" });
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ msg: "Invalid Phone Number" });
      }

      let DuplicatePhone = await UserModel.findOne({
        phone,
        _id: { $ne: userId },
      });

      if (DuplicatePhone) {
        return res.status(400).json({ msg: "Phone Number Already Exists" });
      }
      updateData.phone = phone;
    }
    //bio validation
    if (bio !== undefined) {
      if (bio.trim().length > 200) {
        return res
          .status(400)
          .json({ msg: "Bio Should not exceed 200 Characters." });
      }
      updateData.bio = bio;
    }
    // Update the user profile
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    return res
      .status(200)
      .json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//delete user profile
const deleteProfile = async (req, res) => {
  try {
    let userId = req.user.userId;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found,already deleted" });
    }
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
//Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No Users Found" });
    }
    return res.status(200).json({ msg: "Users found successfully", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
//Delete user Profile (Admin Only)

const deleteUser = async (req, res) => {
  try {
    let userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ msg: "Admin Cannot be deleted" });
    }

    await UserModel.findByIdAndDelete(userId);
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
// Exporting the functions
module.exports = {
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  deleteUser,
};
