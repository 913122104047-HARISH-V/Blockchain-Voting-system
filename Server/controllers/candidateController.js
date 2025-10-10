// controllers/candidateController.js
const Candidate =require("../models/candidate.js");

// Add a candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, party, electionId } = req.body;
    const candidate = await Candidate.create({ name, party, electionId });
    res.json({ message: "Candidate added", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all candidates for a specific election
exports.getCandidatesByElection = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ electionId });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
