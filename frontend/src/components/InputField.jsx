import React from "react";

const InputField = ({ label, type, name, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-300 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none" />
    </div>
  );
};

export default InputField;
