const mongoose = require('mongoose');

// 🧑‍💼 USERS COLLECTION
const userSchema = new mongoose.Schema({
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  faceData: {
    type: String, // can be Base64 encoding, image URL, or embedding vector
  },
  isFaceVerified: {
    type: Boolean,
    default: false,
  },
  walletAddress: {
    type: String,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


module.exports =  mongoose.model("User", userSchema);
