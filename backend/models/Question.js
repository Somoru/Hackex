import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    tags: { type: [String], default: [] },
    real_life_scenario: { type: String },
    input_format: { type: String, required: true },
    output_format: { type: String, required: true },
    constraints: { type: String, required: true },
    time_limit_ms: { type: Number, required: true },
    memory_limit_mb: { type: Number, required: true },
    test_cases: [
        {
            input: { type: String, required: true },
            expected_output: { type: String, required: true },
            is_public: { type: Boolean, default: false }
        }
    ]
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
