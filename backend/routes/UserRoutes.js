const express = require("express").Router();
const multer = require("multer");
const upload = multer();
const authGuard = require("../helpers/authguard");
const roleGuard = require("../helpers/roleGuard");

const { addUser } = require("../controllers/UserController");
const { getActiveUsers } = require("../controllers/UserController");
const { getAllUsers } = require("../controllers/UserController");
const { getUsersById } = require("../controllers/UserController");
const { updateUser } = require("../controllers/UserController");
const { deleteUser } = require("../controllers/UserController");
const { loginUser } = require("../controllers/UserController");
const { logoutUser } = require("../controllers/UserController");
const { forgotPassword } = require("../controllers/UserController");
const { resetPassword } = require("../controllers/UserController");

// Public routes - no authentication required
express.post("/login", loginUser);
express.post("/logout", logoutUser);
express.post("/register", addUser);
express.post("/forgot-password", forgotPassword);
express.post("/reset-password", resetPassword);

// Protected routes - authentication required
express.get("/register", authGuard, getActiveUsers);

// Admin only routes - requires admin role
express.get("/getAllUsers", authGuard, roleGuard('admin'), getAllUsers);
express.delete("/deleteUserById/:id", authGuard, roleGuard('admin'), deleteUser);

// Admin and Dentist routes - requires admin or dentist role
express.get("/getUserById/:id", authGuard, roleGuard('admin', 'dentist'), getUsersById);

// Authenticated user routes - any authenticated user can update their own profile
express.put("/updateUserById/:id", authGuard, upload.single("file"), updateUser);



module.exports=express;