import { getQuestionById } from "../services/questionService.js";

export const fetchQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await getQuestionById(questionId);
        if (!question) return res.status(404).json({ error: "Question not found" });

        res.json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
