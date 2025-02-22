import React from "react";

const Button = ({ label, onClick, className }) => (
  <button onClick={onClick} className={`py-3 px-6 bg-cyan-500 rounded-lg text-black font-bold shadow-md ${className}`}>
    {label}
  </button>
);

export default Button;
