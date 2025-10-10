const mongoose = require('mongoose');

// 🗳️ CANDIDATES COLLECTION
const candidateSchema = new mongoose.Schema({
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    symbol: {
      type: String, // image URL
    },
    walletAddress: {
      type: String,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });



  module.exports =  mongoose.model("Candidate", candidateSchema);