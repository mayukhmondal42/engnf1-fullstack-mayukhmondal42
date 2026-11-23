import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });
export default mongoose.model("User", schema);