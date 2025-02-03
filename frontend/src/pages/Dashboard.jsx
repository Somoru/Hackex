import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false); // ✅ Toggle for event details

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/signup");
        return;
      }

      try {
        const response = await fetch(
          "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUser(data.username);
        setHasPaid(data.hasPaid);
      } catch (error) {
        navigate("/signup");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans relative overflow-hidden">
      {/* 🚀 Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>

      {/* ✨ Main Dashboard Card */}
      <motion.div
        className="relative bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-10 max-w-3xl w-full text-center transform transition duration-500 hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {loading ? (
          // 🔄 Loading State
          <div className="flex flex-col justify-center items-center py-10">
            <motion.div
              className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <p className="text-cyan-300 mt-4 text-lg">Loading Dashboard...</p>
          </div>
        ) : (
          <>
            {/* 🎉 Welcome & Profile */}
            <h2 className="text-5xl font-semibold text-cyan-400 tracking-wide">
              Welcome, {user}! 🚀
            </h2>
            <p className="text-lg text-gray-400 mt-2">Join one of the challenges below.</p>

            {/* 📅 Upcoming Events */}
            <div className="mt-10 text-left">
              <h3 className="text-3xl font-bold text-cyan-400">📅 Upcoming Challenges</h3>

              {/* 🏆 Early Bird's Coding Challenge */}
              <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-md relative">
                <h3 className="text-2xl text-yellow-300 font-bold">🔥 Early Bird's Coding Challenge</h3>
                <p className="text-gray-400 mt-2">"Join now by paying the Entry Fee & compete for top prizes!"</p>

                {/* 📅 Date Box */}
                <div className="absolute top-4 right-4 bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm">
                  📅 Soon
                </div>

                {/* 🏆 Prize Breakdown */}
                {showDetails && (
                  <div className="mt-4 text-gray-300 text-lg bg-gray-900 p-4 rounded-lg shadow-md">
                    <p>🏆 <strong>1st Place:</strong> ₹600</p>
                    <p>🥈 <strong>2nd Place:</strong> ₹300</p>
                    <p>🥉 <strong>3rd Place:</strong> ₹180</p>
                    <p className="text-yellow-300 mt-2">💰 <strong>Entry Fee:</strong> ₹35</p>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-4 mt-4">
                  <motion.button
                    className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-yellow-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert("Joining Early Bird's Week!")}
                  >
                    Join Now
                  </motion.button>

                  <motion.button
                    className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Hide Details" : "View Details"}
                  </motion.button>
                </div>
              </div>

              {/* 📢 Coming Soon Event */}
              <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-md relative">
                <h3 className="text-2xl text-gray-400 font-bold">⏳ Coming Soon...</h3>
                <p className="text-gray-300 mt-2">Stay tuned for the next big event!</p>

                {/* 📅 Date Box */}
                <div className="absolute top-4 right-4 bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm">
                  📅 TBA
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
