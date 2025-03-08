import React from "react";

const SubmissionResult = ({ results }) => {
  return (
    <div className="w-full bg-gray-900 p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-yellow-400">✅ Test Case Results</h2>
      <div className="overflow-x-auto mt-3">
        <table className="w-full border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2 border border-gray-700">Test Case</th>
              <th className="px-4 py-2 border border-gray-700">Input</th>
              <th className="px-4 py-2 border border-gray-700">Expected Output</th>
              <th className="px-4 py-2 border border-gray-700">Your Output</th>
              <th className="px-4 py-2 border border-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((testCase, index) => (
              <tr
                key={index}
                className={`border border-gray-700 text-white ${
                  testCase.status === "Pass" ? "bg-green-900" : "bg-red-900"
                }`}
              >
                <td className="px-4 py-2 text-center border border-gray-700">{index + 1}</td>
                <td className="px-4 py-2 border border-gray-700">{testCase.input}</td>
                <td className="px-4 py-2 border border-gray-700">{testCase.expected_output}</td>
                <td className="px-4 py-2 border border-gray-700">{testCase.user_output}</td>
                <td className="px-4 py-2 text-center border border-gray-700">
                  {testCase.status === "Pass" ? (
                    <span className="text-green-400 text-xl">✅</span>
                  ) : (
                    <span className="text-red-400 text-xl">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionResult;
