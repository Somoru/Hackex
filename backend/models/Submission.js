import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: String, required: true },
    questionId: { type: String, required: true },
    submissionTime: { type: Date, default: Date.now },
    timeTakenSec: { type: Number, required: true },
    testCasesPassed: { type: Number, required: true },
    totalTestCases: { type: Number, required: true },
    incorrectAttempts: { type: Number, default: 0 },
    finalScore: { type: Number, required: true }
});

export default mongoose.model("Submission", SubmissionSchema);
