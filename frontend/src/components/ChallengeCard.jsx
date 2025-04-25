// ChallengeCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChallengeCard = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/code-execution");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full relative p-8 rounded-2xl bg-gray-800/70 backdrop-blur-md shadow-2xl border border-cyan-600 hover:shadow-yellow-400/40 transition-all hover:scale-105 duration-500"
    >
      {/* Title */}
      <h2 className="text-4xl font-bold text-yellow-400 mb-4 text-center">
        🚀 Demo Challenge
      </h2>

      {/* Description */}
      <p className="text-gray-300 text-lg text-center mb-8 leading-relaxed">
        Step into the <span className="text-cyan-400 font-semibold">HackEx Arena</span> and experience coding like never before. Compete, conquer, and elevate your skills to greatness.
      </p>

      {/* Call to Action */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleButtonClick}
          className="px-8 py-4 rounded-lg bg-yellow-400 text-black font-bold text-lg shadow-lg hover:shadow-yellow-400/50 transition-all duration-300"
        >
          🚀 Start Your Challenge
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChallengeCard;
