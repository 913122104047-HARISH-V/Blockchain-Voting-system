const express = require("express");
const router = express.Router();
const { adminLogin, getAllUsers, getAdminDashboard } = require("../controllers/adminController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Public route
router.post("/login", adminLogin);

// Protected routes (only admin)
router.get("/users", protect, adminProtect, getAllUsers);
router.get("/dashboard", protect, adminProtect, getAdminDashboard);

module.exports = router;
