// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getAllTransactions,
  getUserTransactions,
} = require("../controllers/transactionController");

// Routes
router.get("/all", protect, getAllTransactions);
router.get("/user", protect, getUserTransactions);

module.exports = router;
