import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/signup");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/user-status", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      {/* ✨ Neon Glass Card */}
      <div className="bg-gray-800 bg-opacity-40 backdrop-blur-lg shadow-lg border border-gray-600 rounded-2xl p-8 max-w-lg text-center transform transition duration-500 hover:scale-105">
        {loading ? (
          // 🔄 Loading Skeleton
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-64 bg-gray-600 rounded mb-2"></div>
          </div>
        ) : (
          <>
            {/* 🎉 Animated Welcome Message */}
            <h2 className="text-4xl font-extrabold text-cyan-400 tracking-wide glow">
              Welcome, {user}! 🚀
            </h2>
            <p className="text-gray-300 mt-2">Your coding journey starts now.</p>

            {!hasPaid ? (
              <div className="mt-6">
                <p className="text-lg text-yellow-300 mb-4">⚡ Complete payment to access the competition soon.</p>
                <button
                  className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-md transform transition duration-300 hover:scale-110 hover:bg-yellow-500"
                  onClick={() => alert("Payment Gateway Coming Soon!")}
                >
                  Pay ₹35
                </button>
              </div>
            ) : (
              <p className="text-lg text-green-400 mt-4">
                ✅ Payment Completed! Stay tuned for competition updates.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
