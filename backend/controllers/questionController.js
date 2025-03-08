import { getQuestionById, getRandomUnseenQuestion } from "../services/questionService.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";


export const fetchQuestion = async (req, res) => {
    console.log("🚀 API Hit: /api/questions/:questionId");

    try {
        const { questionId } = req.params;
        console.log("🔎 Searching for question with ID:", questionId);

        const question = await getQuestionById(questionId);

        if (!question) {
            console.log("❌ Question not found:", questionId);
            return res.status(404).json({ error: "Question not found" });
        }

        console.log("✅ Question Found:", question.id);
        res.json(question);
    } catch (error) {
        console.error("🔥 Error in fetchQuestion:", error);
        res.status(500).json({ error: error.message });
    }
};


// ✅ API for Dynamic Question Selection
export const getNextQuestion = async (req, res) => {
    console.log("🚀 API Hit: /api/questions/next");

    if (!req.user) {
        console.log("❌ No user found in request.");
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("✅ User ID:", req.user.userId);

    try {
        const userId = req.user.userId;
        console.log("🔍 Fetching last submission...");
        const lastSubmission = await Submission.findOne({ userId }).sort({ createdAt: -1 });
        console.log("📜 Last Submission:", lastSubmission);

        let nextDifficulty = "easy"; // Default difficulty

        if (lastSubmission) {
            const testCasesPassed = lastSubmission.testCasesPassed;
            const totalTestCases = lastSubmission.totalTestCases;

            console.log(`✅ Test Cases Passed: ${testCasesPassed}/${totalTestCases}`);

            // ✅ Fix the final score calculation
            let finalScore = 0;
            if (totalTestCases > 0) {
                finalScore = (testCasesPassed / totalTestCases) * 100; // Calculate percentage
            }
            console.log(`✅ Computed Final Score: ${finalScore}%`);

            // ✅ Correct difficulty progression logic
            if (finalScore >= 75) {
                if (lastSubmission.difficulty === "easy") nextDifficulty = "medium";
                else if (lastSubmission.difficulty === "medium") nextDifficulty = "hard";
            } else {
                nextDifficulty = "easy";
            }

            console.log(`📌 Next Difficulty Level: ${nextDifficulty}`);
        }

        // ✅ Fetch unseen question
        console.log("🔎 Fetching unseen question...");
        const nextQuestion = await getRandomUnseenQuestion(userId, nextDifficulty);

        if (!nextQuestion) {
            console.log("❌ No unseen question found.");
            return res.status(404).json({ error: "No unseen questions available" });
        }

        console.log("✅ Next Question Found:", nextQuestion.id);
        await User.findByIdAndUpdate(userId, { $push: { attemptedQuestions: nextQuestion.id } });

        res.json(nextQuestion);
    } catch (error) {
        console.error("🔥 Error in `getNextQuestion`:", error);
        res.status(500).json({ error: "Error fetching next question" });
    }
};

