const { Schema, model } = require("mongoose");

const voterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    constituency_id: { type: Schema.Types.ObjectId, ref: "Constituency", required: true, index: true },
    aadhaar_number: { type: String, required: true, unique: true, trim: true },
    aadhaar_hash: { type: String, required: false, unique: false, index: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    face_embedding: { type: String, default: null },
    hasCompletedKYC: { type: Boolean, required: true, default: false },
    voter_status: {
      type: String,
      enum: ["eligible", "suspended", "blocked"],
      required: true,
      default: "eligible",
    },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    collection: "voters",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model("Voter", voterSchema);
