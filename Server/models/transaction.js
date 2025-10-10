const mongoose = require('mongoose');

// 🧾 TRANSACTIONS COLLECTION
const transactionSchema = new mongoose.Schema({
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  });
  


  module.exports = mongoose.model("Transaction", transactionSchema);