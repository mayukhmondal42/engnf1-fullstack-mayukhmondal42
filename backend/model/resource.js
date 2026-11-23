import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  capacity: Number,
  location: String
}, { timestamps: true });
export default mongoose.model("Resource", schema);