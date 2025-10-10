const mongoose = require('mongoose');

// 🏛️ ELECTIONS COLLECTION
const electionSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming",
    },
    smartContractAddress: {
      type: String, // blockchain contract address
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });



  module.exports =  mongoose.model("Election", electionSchema);