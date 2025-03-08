import { executeCode } from "../services/executionService.js";
import { getQuestionById } from "../services/questionService.js";
import { updateLeaderboard } from "./leaderboardController.js";

export const submitCode = async (req, res) => {
    try {
        const { language, code, questionId } = req.body;

        if (!language || !code || !questionId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        

        const question = await getQuestionById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        const executionResult = await executeCode(language, code, question.test_cases);

        // ✅ Now userId is correctly passed
        

        res.json({
            questionId: question.id,
            title: question.title,
            description: question.description,
            input_format: question.input_format,
            output_format: question.output_format,
            constraints: question.constraints,
            results: executionResult
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
