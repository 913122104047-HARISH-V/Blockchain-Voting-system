const { Schema, model } = require("mongoose");

const partySchema = new Schema(
  {
    election_id: { type: Schema.Types.ObjectId, ref: "Election", required: true, index: true },
    name: { type: String, required: true, trim: true },
    symbol: { type: String, default: null },
  },
  {
    collection: "parties",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

partySchema.index({ election_id: 1, name: 1 }, { unique: true });

module.exports = model("Party", partySchema);
