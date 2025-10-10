// controllers/adminController.js
const User = require("../models/user.js");
const Election = require("../models/election.js");
const Candidate = require("../models/candidate.js");
const Transaction = require("../models/transaction.js");
const Admin = require("../models/admin.js");
const jwt = require("jsonwebtoken");


// Admin login
exports.adminLogin = async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Admin login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all registered users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin overview dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const electionCount = await Election.countDocuments();
    const candidateCount = await Candidate.countDocuments();
    const totalVotes = await Transaction.countDocuments();

    res.json({ userCount, electionCount, candidateCount, totalVotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
