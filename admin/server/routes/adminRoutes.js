const express = require("express");
const { 
  loginAdmin, 
  logoutAdmin, 
  verifyToken, 
  getProfile 
} = require("../controllers/adminController");

const router = express.Router();

// Public routes
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

// Protected routes
router.get("/profile", verifyToken, getProfile);

module.exports = router;
