import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, setCode }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full">
      <h2 className="text-xl font-semibold text-cyan-400">📝 Code Editor</h2>
      <div className="border border-gray-700 rounded-md mt-2">
        <Editor
          height="300px"
          width="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(newCode) => setCode(newCode)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
