import mongoose from "mongoose";
const schema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  event: String,
  from: mongoose.Schema.Types.Mixed,
  to: mongoose.Schema.Types.Mixed,
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String
}, { timestamps: true });
export default mongoose.model("TicketEvent", schema);