const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  aadharNumber: {
    type: String,
    required: true,
    unique: true,
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
});

module.exports = mongoose.model("User", userSchema);
