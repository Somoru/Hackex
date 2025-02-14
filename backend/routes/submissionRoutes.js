import express from "express";
import Submission from "../models/Submission.js";
import { executeCode } from "../services/executionService.js";
import Question from "../models/Question.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/submit", async (req, res) => {
    try {
        const { language, code, questionId, timeTakenSec } = req.body;

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const question = await Question.findOne({ id: questionId });
        if (!question) return res.status(404).json({ message: "Question not found" });

        const executionResult = await executeCode(language, code, question.test_cases);

        // Count passed test cases
        const testCasesPassed = executionResult.test_cases.filter(tc => tc.status === "Pass").length;
        const totalTestCases = question.test_cases.length;

        // Get previous attempts
        const previousAttempts = await Submission.countDocuments({ userId, questionId });

        // Calculate score
        const baseScore = question.difficulty === "Easy" ? 10 : question.difficulty === "Medium" ? 20 : 40;
        const accuracy = testCasesPassed / totalTestCases;
        const penalty = previousAttempts * 2; // Each retry loses 2 points
        const timeBonus = timeTakenSec < 300 ? 5 : timeTakenSec < 600 ? 3 : 0;

        const finalScore = Math.max(baseScore * accuracy - penalty + timeBonus, 0);

        // Save submission
        const submission = new Submission({
            userId,
            challengeId: "early_bird",
            questionId,
            timeTakenSec,
            testCasesPassed,
            totalTestCases,
            incorrectAttempts: previousAttempts,
            finalScore
        });

        await submission.save();

        res.json({ message: "Submission recorded", finalScore, executionResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Submission failed" });
    }
});

export default router;
