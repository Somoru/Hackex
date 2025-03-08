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
    if (!question) {
      fetchQuestion();
    }
  }, []);

  const fetchQuestion = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/questions/next", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        language: language,
        code: code,
        questionId: question.id,
        challengeName: "Weekly Challenge",
        timeTakenSec: question.time_limit_ms / 1000 // ✅ Convert time from question
    };

    console.log("🚀 Sending Submission Payload:", submissionPayload);

    try {
        const response = await axios.post(
            "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/submissions/submit",
            submissionPayload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("✅ Submission Recorded!");

        // ✅ Fetch new question after submission
        localStorage.removeItem("currentQuestion"); // Remove old question
        setQuestion(null);
        fetchQuestion();
    } catch (err) {
        console.error("❌ Error submitting code:", err.response?.data || err);
    }
};


  if (!question) return <div className="text-white">Loading...</div>;

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row gap-6 p-6 pt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
      onContextMenu={(e) => e.preventDefault()} 
      onCopy={(e) => e.preventDefault()} 
      onCut={(e) => e.preventDefault()} 
      onPaste={(e) => e.preventDefault()}
    >
      {/* Left Pane: Question Details */}
      <div className="w-full md:w-1/2 bg-gray-900 p-6 rounded-lg shadow-md select-text">
        <h1 className="text-3xl font-bold text-cyan-400">💡 {question.title}</h1>
        <p className="text-lg text-gray-300 mt-3">{question.description}</p>

        {/* Sample Test Cases */}
        <div className="mt-6">
          <h2 className="text-xl text-yellow-400">🧪 Sample Test Cases</h2>
          <ul className="mt-3 space-y-3">
            {question.test_cases.slice(0, 2).map((testCase, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-md">
                <strong>Input:</strong> {testCase.input}<br />
                <strong>Output:</strong> {testCase.expected_output}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Pane: Code Editor & Execution Results */}
      <div className="w-full md:w-1/2 space-y-6">
        
        {/* Language Selector */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl text-cyan-400">🌐 Select Language</h2>
          <select
            className="mt-2 p-2 rounded-md bg-gray-800 text-white w-full"
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

        {/* Code Editor */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl text-cyan-400">📝 Code Editor</h2>
          <Editor
            height="300px"
            theme="vs-dark"
            language={language}
            value={code}
            options={{
              readOnly: false,
            }}
            onChange={(newCode) => setCode(newCode)}
            onMount={(editor) => {
              editor.onDidPaste((e) => e.preventDefault());
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleExecute}
            className={`px-6 py-2 font-semibold rounded-md shadow-md ${
              executing ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-yellow-500 text-black hover:bg-yellow-400"
            }`}
            disabled={executing}
          >
            ▶️ Run Code
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 font-semibold rounded-md shadow-md ${
              executing ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-400"
            }`}
            disabled={executing}
          >
            🚀 Submit Code
          </button>
        </div>

        {/* Test Case Results Table */}
        {results && (
          <div className="bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-xl text-yellow-400">✅ Test Case Results</h2>
            <table className="w-full mt-3 border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="p-2 border border-gray-600">Input</th>
                  <th className="p-2 border border-gray-600">Your Output</th>
                  <th className="p-2 border border-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.test_cases.map((testCase, index) => (
                  <tr key={index} className="border border-gray-700">
                    <td className="p-2">{testCase.input}</td>
                    <td className="p-2">{testCase.output}</td>
                    <td className={`p-2 font-bold ${
                      testCase.status === "Pass" ? "text-green-400" : "text-red-400"
                    }`}>
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
