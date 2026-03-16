import { Schema, model } from "mongoose";

const walletBindingSchema = new Schema(
  {
    voter_id: { type: Schema.Types.ObjectId, ref: "Voter", required: true },
    wallet_address: { type: String, required: true, unique: true, lowercase: true, trim: true },
    is_primary: { type: Boolean, required: true, default: true },
    bound_at: { type: Date, required: true, default: Date.now },
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: "wallet_bindings",
    versionKey: false,
  }
);

walletBindingSchema.index({ voter_id: 1, is_primary: 1 }, { unique: true });

export default model("WalletBinding", walletBindingSchema);
