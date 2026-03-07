const { Schema, model } = require("mongoose");

const verificationLogSchema = new Schema(
  {
    voter_id: { type: Schema.Types.ObjectId, ref: "Voter", required: true },
    otp_verified: { type: Boolean, required: true, default: false },
    face_verified: { type: Boolean, required: true, default: false },
    kyc_timestamp: { type: Date, required: true, default: Date.now },
    ip_address: { type: String, default: null },
    device_info: { type: String, default: null },
  },
  {
    collection: "verification_logs",
    versionKey: false,
  }
);

module.exports = model("VerificationLog", verificationLogSchema);
