// controllers/transactionController.js
const Transaction = require("../models/transaction.js");

// Get all vote transactions (admin or audit purpose)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("voterId", "name aadhaarNumber")
      .populate("candidateId", "name party")
      .populate("electionId", "title");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions for a specific user
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ voterId: req.user.id })
      .populate("candidateId", "name party")
      .populate("electionId", "title");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
