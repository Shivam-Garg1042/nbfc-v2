import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', 
    required: true 
  },
  organization: String,
  credits: {
    type: Number,
    default: 2000,
  },
});

export default mongoose.model("User", userSchema);
