import Question from "../models/Question.js";

export const getQuestionById = async (questionId) => {
    try {
        return await Question.findOne({ id: questionId });
    } catch (error) {
        throw new Error("Error fetching question: " + error.message);
    }
};
