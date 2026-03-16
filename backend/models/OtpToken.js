import { Schema, model } from "mongoose";

const otpTokenSchema = new Schema(
  {
    scope: { type: String, required: true, trim: true, index: true },
    subject_id: { type: String, required: true, trim: true, index: true },
    otp_hash: { type: String, required: true },
    expires_at: { type: Date, required: true },
  },
  {
    collection: "otp_tokens",
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

otpTokenSchema.index({ scope: 1, subject_id: 1 }, { unique: true });
otpTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default model("OtpToken", otpTokenSchema);
