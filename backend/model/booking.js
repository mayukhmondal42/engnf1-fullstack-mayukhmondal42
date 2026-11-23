import mongoose from "mongoose";
const schema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["CONFIRMED","CANCELLED"], default: "CONFIRMED" }
}, { timestamps: true });
export default mongoose.model("Booking", schema);