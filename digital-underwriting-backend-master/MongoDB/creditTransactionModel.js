import mongoose from "mongoose";

const creditTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
  },
  delta: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

creditTransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default mongoose.model("CreditTransaction", creditTransactionSchema);
