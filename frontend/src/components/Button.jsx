import React from "react";

const Button = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-lg font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-600 transition duration-300 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
