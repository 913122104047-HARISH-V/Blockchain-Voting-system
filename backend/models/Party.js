const { Schema, model } = require("mongoose");

const partySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    symbol: { type: String, default: null },
  },
  {
    collection: "parties",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model("Party", partySchema);
