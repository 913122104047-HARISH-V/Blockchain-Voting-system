// routes/authRoutes.js
const express = require('express');
const{loginWithAadhaar, verifyOtp,/* verifyFace,getUserDashboard*/} =require("../controllers/authController.js");

const router = express.Router();

// Step 1: Aadhaar Login → Send OTP
router.post("/login", loginWithAadhaar);

// Step 2: Verify OTP
router.post("/verify-otp", verifyOtp);

// Step 3: Face Authentication
//router.post("/verify-face", verifyFace);

// Step 4: Dashboard access (only after face auth)
//router.get("/dashboard/:userId", getUserDashboard);

module.exports = router;
