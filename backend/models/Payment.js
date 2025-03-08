import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  merchantOrderId: { type: String, required: true, unique: true },
  transactionId: { type: String, default: null, sparse: true },
  amount: { type: Number, required: true },
  week: { type: String, required: true, index: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  paymentDate: { type: Date },
}, { timestamps: true });

// ✅ Indexing for faster payment lookups
PaymentSchema.index({ userId: 1, week: 1 });

export default mongoose.model("Payment", PaymentSchema);
