import { Schema, model } from "mongoose";

const constituencySchema = new Schema(
  {
    state_id: { type: Schema.Types.ObjectId, ref: "State", required: true, index: true },
    on_chain_id: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    total_voters: { type: Number, required: true, default: 0 },
  },
  {
    collection: "constituencies",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

constituencySchema.index({ state_id: 1, name: 1 }, { unique: true });

export default model("Constituency", constituencySchema);
