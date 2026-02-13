import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: String,
  permissions: [String],
});

export default mongoose.model("Role", roleSchema);
