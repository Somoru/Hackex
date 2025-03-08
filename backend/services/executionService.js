import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const ACI_EXECUTOR_URL = process.env.ACI_EXECUTOR_URL;

export const executeCode = async (language, code, testCases) => {
    try {
        const publicTestCases = testCases.filter(tc => tc.is_public)
            .map(tc => ({ input: tc.input, expected: tc.expected_output }));

        if (publicTestCases.length === 0) {
            throw new Error("No public test cases available");
        }

        const response = await axios.post(ACI_EXECUTOR_URL, {
            language,
            code,
            test_cases: publicTestCases,
            timeout: 5, // ⏳ Limit execution time
            memory_limit: 128 // 🔥 Restrict memory usage
        });

        return response.data;
    } catch (error) {
        throw new Error("Execution failed: " + error.message);
    }
};
