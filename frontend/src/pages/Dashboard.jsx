import React, { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import { getUserStatus } from "../services/authService";
import axios from "axios";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Not Submitted");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserStatus();
  
      if (!userData) {
        console.warn("🚫 User not authenticated. Redirecting...");
        window.location.href = "/signup"; // 🚀 Redirect if no user data
        return;
      }
  
      setUser(userData.username);
      setPaymentStatus(userData.paymentStatus);
      setLoading(false);
    };

    const fetchPaymentStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const { data } = await axios.get(
          "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/payment/status",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.paymentStatus) {
          setPaymentStatus(data.paymentStatus); // ✅ Update the paymentStatus state
        }
      } catch (error) {
        console.error("❌ Error fetching payment status:", error);
      }
    };

    fetchPaymentStatus(); // Fetch status on component mount
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
        : paymentStatus === "Not Applicable"
        ? "bg-gray-500 text-white"
        : "bg-red-500 text-white"
    }`}
  >
    {paymentStatus}
  </span>
</p>
{user?.paymentStatus === "Verified" && new Date() < new Date("2025-03-14T00:00:00Z") && (
  <p className="text-sm text-green-400 mt-2">
    ✅ You’ve already paid. You can pay again after March 14th.
  </p>
)}
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
