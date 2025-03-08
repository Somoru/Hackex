import express from "express";
import Submission from "../models/Submission.js";
import { executeCode } from "../services/executionService.js";
import { getQuestionById } from "../services/questionService.js";
import { authenticateUser, ensurePaidUser } from "../middlewares/authMiddleware.js";
import { updateLeaderboard } from "../controllers/leaderboardController.js";
const router = express.Router();

router.post("/submit", authenticateUser, ensurePaidUser, async (req, res) => {
    try {
        console.log("🚀 Received Submission Request:", req.body);

        const { language, code, challengeName, questionId, timeTakenSec } = req.body;

        // 🔍 Validate request body
        if (!language || !code || !challengeName || !questionId || timeTakenSec === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 🔍 Fetch the question
        console.log("🔍 Fetching question:", questionId);
        const question = await getQuestionById(questionId);
        if (!question) {
            console.error("❌ Question Not Found:", questionId);
            return res.status(404).json({ error: "Question not found" });
        }
        console.log("✅ Found Question:", question.title);

        // 🚀 Execute the Code
        console.log("🔄 Executing Code...");
        const executionResult = await executeCode(language, code, question.test_cases);
        console.log("✅ Execution Completed.");

        // 🔍 Count passed test cases
        const testCasesPassed = executionResult.test_cases.filter(tc => tc.status === "Pass").length;
        const totalTestCases = question.test_cases.length;
        console.log(`✅ Test Cases Passed: ${testCasesPassed}/${totalTestCases}`);

        // 🔍 Check previous attempts
        const previousAttempts = await Submission.countDocuments({
            userId: req.user.userId,
            questionId,
            challengeName
        });
        console.log("✅ Previous Attempts:", previousAttempts);

        // ✅ Score Calculation (Now ensuring at least one test case must pass)
        const baseScore = question.difficulty === "Easy" ? 10 : question.difficulty === "Medium" ? 20 : 40;
        const accuracy = testCasesPassed / totalTestCases;
        const penalty = previousAttempts * 2;
        const timeBonus = timeTakenSec < 300 ? 5 : timeTakenSec < 600 ? 3 : 0;
        
        let finalScore = 0;
        if (testCasesPassed > 0) {
            finalScore = Math.max(baseScore * accuracy - penalty + timeBonus, 0);
        }
        console.log("✅ Final Score:", finalScore);

        // 🔍 Saving submission to database
        console.log("📥 Saving submission...");
        const submission = new Submission({
            userId: req.user.userId,
            challengeName,
            questionId,
            timeTakenSec,
            testCasesPassed,
            totalTestCases,
            incorrectAttempts: previousAttempts,
            finalScore
        });

        await submission.save();
        console.log("✅ Submission Saved Successfully!");

        await updateLeaderboard(userId);

        res.json({
            message: "Submission recorded",
            questionId: question.id,
            title: question.title,
            testCasesPassed,
            totalTestCases,
            finalScore,
            executionResult
        });

    } catch (error) {
        console.error("🔥 Submission Error:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            details: error.message, 
            stack: error.stack 
        });
    }
});

export default router;
