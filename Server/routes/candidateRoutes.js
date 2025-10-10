// routes/candidateRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addCandidate,
  getCandidatesByElection,
} = require("../controllers/candidateController");

// Routes
router.post("/add", protect, addCandidate);
router.get("/:electionId", protect, getCandidatesByElection);

module.exports = router;
