import mongoose from "mongoose";
const schema = new mongoose.Schema({
  externalId: { type: String, unique: true, required: true },
  title: String,
  description: String,
  category: { type: String, enum: ["BILLING","LOGIN","DELIVERY","BUG","FEATURE_REQUEST"] },
  priority: { type: String, enum: ["URGENT","HIGH","MEDIUM"], default: "MEDIUM" },
  status: { type: String, enum: ["OPEN","IN_PROGRESS","RESOLVED"], default: "OPEN" },
  categoryOverridden: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("Ticket", schema);