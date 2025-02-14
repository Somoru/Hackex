import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transactionID: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"], default: "PENDING" },
    createdAt: { type: Date, default: Date.now }
});

// ✅ Use ES6 export
const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
