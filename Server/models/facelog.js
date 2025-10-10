const mongoose = require('mongoose');

   // 🕵️ FACE LOGS COLLECTION (optional, for tracking)
   const faceLogSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    matchConfidence: {
      type: Number, // percentage (0–100)
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  });


  module.exports =  mongoose.model("FaceLog", faceLogSchema);