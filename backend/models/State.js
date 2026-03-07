const { Schema, model } = require("mongoose");

const stateSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    total_constituencies: { type: Number, required: true, default: 0 },
    majority_mark: { type: Number, required: true, default: 0 },
  },
  {
    collection: "states",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model("State", stateSchema);
