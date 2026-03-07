const crypto = require("crypto");

function hashAadhaar(aadhaarNumber) {
  if (!aadhaarNumber) {
    throw new Error("Aadhaar number is required");
  }
  return crypto.createHash("sha256").update(String(aadhaarNumber).trim()).digest("hex");
}

module.exports = {
  hashAadhaar,
};
