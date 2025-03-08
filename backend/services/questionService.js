import Question from "../models/Question.js";
import User from "../models/User.js";

// ✅ Fetch question by ID
export const getQuestionById = async (questionId) => {
    try {
        return await Question.findOne({ id: questionId });
    } catch (error) {
        throw new Error("Error fetching question: " + error.message);
    }
};

export const getRandomUnseenQuestion = async (userId, difficulty) => {
    console.log(`🔎 Fetching unseen question for difficulty: ${difficulty}`);

    try {
        const user = await User.findById(userId);
        let attemptedQuestions = user?.attemptedQuestions || [];

        console.log("🔍 Attempted Questions Before Reset:", attemptedQuestions);

        let question = null;
        let attempts = 0;

        while (!question && attempts < 5) { // Try up to 5 times
            const randomNum = Math.floor(Math.random() * 100) + 1; // ✅ Limited to 1-100
            const questionId = `${difficulty}_${randomNum}`; // ✅ Correct format

            console.log(`🔍 Trying question ID: ${questionId}`);

            question = await Question.findOne({ id: questionId });

            if (question && !attemptedQuestions.includes(questionId)) {
                console.log(`✅ Found question: ${question.id}`);
                return question;
            }

            attempts++;
        }

        console.log("❌ No unseen questions found after 5 attempts. Resetting attempt history...");
        await User.findByIdAndUpdate(userId, { $set: { attemptedQuestions: [] } });

        // ✅ Fetch a completely new question after reset
        const randomNum = Math.floor(Math.random() * 100) + 1; // ✅ Again, limited to 1-100
        const questionId = `${difficulty}_${randomNum}`;

        console.log(`🔄 Retrying after reset. Trying ID: ${questionId}`);

        question = await Question.findOne({ id: questionId });

        if (!question) {
            console.log("❌ Still no questions found after reset.");
            return null;
        }

        console.log(`✅ Selected Question After Reset: ${question.id}`);
        return question;
    } catch (error) {
        console.error("🔥 Error in `getRandomUnseenQuestion`:", error);
        return null;
    }
};
