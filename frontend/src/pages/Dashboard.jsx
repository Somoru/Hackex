// Dashboard.jsx
import React, { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { getUserStatus } from "../services/authService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserStatus();

      if (!userData) {
        console.warn("🚫 User not authenticated. Redirecting...");
        window.location.href = "/signup";
        return;
      }

      setUser(userData.username);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden p-6">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl font-extrabold text-cyan-400 tracking-tight">
              Welcome back, <span className="text-yellow-400">{user}</span> 👋
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Every line of code you write today shapes your tomorrow. Are you ready to make it legendary?
            </p>
          </div>

          {/* Challenge Card Section */}
          <div className="w-full max-w-3xl flex flex-col items-center space-y-10">
            <ChallengeCard />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
