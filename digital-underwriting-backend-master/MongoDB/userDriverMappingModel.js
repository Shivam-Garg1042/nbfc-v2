import mongoose from "mongoose";

const userDriverMappingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    userEmail: String,
    organization: String,
    driverIds: {
      type: [String],
      default: [],
    },
    updatedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("UserDriverMapping", userDriverMappingSchema);
