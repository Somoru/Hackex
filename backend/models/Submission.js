import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeName: { type: String, required: true, index: true }, // 🔥 Challenge-Specific
    questionId: { type: String, required: true },
    timeTakenSec: { type: Number, required: true },
    testCasesPassed: { type: Number, required: true },
    totalTestCases: { type: Number, required: true },
    incorrectAttempts: { type: Number, default: 0 },
    finalScore: { type: Number, required: true, index: true }
});

// ✅ Optimized for leaderboard ranking
SubmissionSchema.index({ challengeName: 1, finalScore: -1 });

export default mongoose.model("Submission", SubmissionSchema);
