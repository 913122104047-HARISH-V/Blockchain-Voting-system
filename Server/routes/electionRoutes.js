// routes/electionRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createElection,
  getAllElections,
  castVote,
  getElectionResults,
} = require("../controllers/electionController");

// Routes
router.post("/create", protect, createElection);
router.get("/", protect, getAllElections);
router.post("/vote", protect, castVote);
router.get("/:electionId/results", protect, getElectionResults);

module.exports = router;
