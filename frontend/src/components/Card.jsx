import React from "react";

const Card = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-cyan-400 hover:scale-105 transition-transform duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-cyan-400">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
};

export default Card;
