import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

const CodeExecution = () => {
  const [question, setQuestion] = useState(JSON.parse(localStorage.getItem("currentQuestion")) || null);
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("c");
  const [results, setResults] = useState(null);
  const [errorLog, setErrorLog] = useState(null);
  const [executing, setExecuting] = useState(false);

  const supportedLanguages = [
    { label: "C", value: "c" },
    { label: "C++", value: "cpp" },
    { label: "Java", value: "java" },
    { label: "Python", value: "python" },
    { label: "JavaScript", value: "javascript" },
  ];

  useEffect(() => {
    if (!question) fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/questions/next",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestion(response.data);
      localStorage.setItem("currentQuestion", JSON.stringify(response.data));
    } catch (err) {
      console.error("❌ Error fetching question:", err);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResults(null);
    setErrorLog(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/code/execute",
        { language, code, questionId: question.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data.results);
    } catch (err) {
      console.error("❌ Error executing code:", err);
      setErrorLog(err.response?.data?.error || "Unknown execution error.");
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (!results) {
      alert("❌ Run your code before submitting!");
      return;
    }

    const token = localStorage.getItem("authToken");

    const submissionPayload = {
      language,
      code,
      questionId: question.id,
      challengeName: "Weekly Challenge",
      timeTakenSec: question.time_limit_ms / 1000,
    };

    try {
      await axios.post(
        "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/submissions/submit",
        submissionPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Submission Recorded!");
      localStorage.removeItem("currentQuestion");
      setQuestion(null);
      fetchQuestion();
    } catch (err) {
      console.error("❌ Error submitting code:", err.response?.data || err);
    }
  };

  if (!question) return <div className="text-white p-6">Loading question...</div>;

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row gap-6 p-6 pt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* 📘 LEFT PANE: Question Section */}
      <div className="w-full md:w-1/2 bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-cyan-500/30">
        <h1 className="text-3xl font-bold text-yellow-400">💡 {question.title}</h1>
        <p className="text-lg text-gray-300 mt-3 leading-relaxed">{question.description}</p>

        {/* 🧪 Test Cases */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-cyan-400">🧪 Sample Test Cases</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {question.test_cases.slice(0, 2).map((testCase, index) => (
              <li key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-gray-200">
                <div><span className="font-bold ">Input:</span> {testCase.input}</div>
                <div><span className="font-bold ">Expected Output:</span> {testCase.expected_output}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 💻 RIGHT PANE: Editor + Actions */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* 🌐 Language Selector */}
        <div className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-400">🌐 Select Language</h2>
          <select
            className="mt-3 p-2 rounded-md bg-gray-800 text-white w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* 📝 Code Editor */}
        <div className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">📝 Code Editor</h2>
          <Editor
            height="300px"
            theme="vs-dark"
            language={language}
            value={code}
            options={{ readOnly: false }}
            onChange={(newCode) => setCode(newCode)}
            onMount={(editor) => {
              editor.onDidPaste((e) => e.preventDefault());
            }}
          />
        </div>

        {/* ⚙️ Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleExecute}
            className={`px-6 py-2 font-bold rounded-lg transition duration-300 ${
              executing
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-300 shadow-md"
            }`}
            disabled={executing}
          >
            ▶️ Run Code
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 font-bold rounded-lg transition duration-300 ${
              executing
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-400 shadow-md"
            }`}
            disabled={executing}
          >
            🚀 Submit Code
          </button>
        </div>

        {/* ✅ Test Case Results */}
        {results && (
          <div className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700">
            <h2 className="text-xl font-semibold text-yellow-400 mb-3">✅ Test Case Results</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-gray-200">
                  <th className="p-2 border border-gray-700">Input</th>
                  <th className="p-2 border border-gray-700">Your Output</th>
                  <th className="p-2 border border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.test_cases.map((testCase, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray-700">{testCase.input}</td>
                    <td className="p-2 border border-gray-700">{testCase.output}</td>
                    <td
                      className={`p-2 font-semibold border border-gray-700 ${
                        testCase.status === "Pass" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {testCase.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExecution;
