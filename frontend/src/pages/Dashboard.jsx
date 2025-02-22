import React, { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Not Submitted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status",
          { method: "GET", credentials: "include" } // ✅ Include cookies for auth
        );

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUser(data.username);
        setPaymentStatus(data.paymentStatus);
      } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "/signup"; // 🚀 Redirect if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 pt-24">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl text-center space-y-12">
          <h1 className="text-5xl font-extrabold text-cyan-400">
            Welcome, <span className="text-yellow-400">{user}!</span> 🚀
          </h1>

          <p className="text-lg text-gray-400">
            <strong>Payment Status:</strong>{" "}
            <span
              className={`font-bold px-3 py-1 rounded-md ${
                paymentStatus === "Verified"
                  ? "bg-green-600 text-white"
                  : paymentStatus === "Pending"
                  ? "bg-yellow-500 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              {paymentStatus}
            </span>
          </p>

          <div className="w-full flex flex-col items-center space-y-8">
            <h2 className="text-3xl font-bold text-yellow-400">🔥 Active Challenge</h2>
            <div className="w-full max-w-2xl bg-gray-800 bg-opacity-40 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700">
              <ChallengeCard
                title="💡 Weekly Coding Challenge"
                startDate="Mar 5"
                endDate="Mar 12"
                entryFee="₹39"
                paymentStatus={paymentStatus}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
