import mongoose from "mongoose";

const ExecutionHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    results: { type: Array, required: true },
    status: { type: String, enum: ["Success", "Failed"], required: true },
    executedAt: { type: Date, default: Date.now }
});

export default mongoose.model("ExecutionHistory", ExecutionHistorySchema);
