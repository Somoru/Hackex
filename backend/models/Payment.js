import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  merchantOrderId: { type: String, required: true, unique: true },
  transactionId: { type: String, default: null, sparse: true }, // ✅ Allow null & unique only for non-null values
  amount: { type: Number, required: true },
  week: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  paymentDate: { type: Date },
}, { timestamps: true });


const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
