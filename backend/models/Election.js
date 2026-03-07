const { Schema, model } = require("mongoose");

const electionSchema = new Schema(
  {
    state_id: { type: Schema.Types.ObjectId, ref: "State", required: true, index: true },
    title: { type: String, required: true, trim: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "scheduled", "active", "completed", "cancelled"],
      required: true,
      default: "draft",
    },
    created_by_admin: { type: String, required: true },
  },
  {
    collection: "elections",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model("Election", electionSchema);
