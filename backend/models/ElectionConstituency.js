import { Schema, model } from "mongoose";

const electionConstituencySchema = new Schema(
  {
    election_id: { type: Schema.Types.ObjectId, ref: "Election", required: true },
    constituency_id: { type: Schema.Types.ObjectId, ref: "Constituency", required: true },
    status: { type: String, enum: ["active", "inactive"], required: true, default: "active" },
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: "election_constituencies",
    versionKey: false,
  }
);

electionConstituencySchema.index({ election_id: 1, constituency_id: 1 }, { unique: true });

export default model("ElectionConstituency", electionConstituencySchema);
