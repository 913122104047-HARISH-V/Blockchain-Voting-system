const { Schema, model } = require("mongoose");

const candidateSchema = new Schema(
  {
    election_id: { type: Schema.Types.ObjectId, ref: "Election", required: true },
    constituency_id: { type: Schema.Types.ObjectId, ref: "Constituency", required: true },
    name: { type: String, required: true, trim: true },
    party_id: { type: Schema.Types.ObjectId, ref: "Party", default: null },
    symbol: { type: String, default: null },
    wallet_address: { type: String, required: true, lowercase: true, trim: true },
    is_active: { type: Boolean, required: true, default: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: "candidates",
    versionKey: false,
  }
);

candidateSchema.index({ election_id: 1, constituency_id: 1 });

module.exports = model("Candidate", candidateSchema);
