// controllers/electionController.js
const Election =require("../models/election.js");
const Candidate =require("../models/candidate.js");
const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");

// Create election (Admin only)
exports.createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const election = await Election.create({ title, description, startDate, endDate });
    res.json({ message: "Election created", election });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all elections
exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cast vote
exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const userId = req.user.id;

    const election = await Election.findById(electionId);
    if (!election || new Date() > election.endDate)
      return res.status(400).json({ message: "Election ended or invalid" });

    const alreadyVoted = await Transaction.findOne({ electionId, voterId: userId });
    if (alreadyVoted) return res.status(400).json({ message: "Already voted" });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const vote = await Transaction.create({
      electionId,
      voterId: userId,
      candidateId,
      timestamp: Date.now(),
    });

    candidate.voteCount += 1;
    await candidate.save();

    res.json({ message: "Vote recorded successfully", vote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get election results
exports.getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ electionId }).sort({ voteCount: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
