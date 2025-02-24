import { useState, useEffect } from "react";
import axios from "axios";

const PaymentForm = ({ onClose }) => {
  const [amount, setAmount] = useState(39); // Default entry fee
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Authentication error. Please log in again.");
        window.location.href = "/login";
        return;
      }

      try {
        console.log("🔍 Fetching user status with token...");
        const { data } = await axios.get(
          "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Use Authorization header
            },
          }
        );

        if (!data?.username) throw new Error("User data not found.");
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        alert("Authentication error. Please log in again.");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, []);

  const handlePayment = async () => {
    const token = localStorage.getItem("authToken");

    if (!token || !user) {
      alert("Authentication error. Please log in again.");
      return;
    }

    try {
      console.log("📡 Initiating Payment:", { amount });
      const { data } = await axios.post(
        "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/payment/initiate",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token like Postman
          },
        }
      );

      if (data.success && data.redirectUrl) {
        alert("Redirecting to payment page...");
        window.location.href = data.redirectUrl; // ✅ Redirect to payment gateway
      } else {
        console.error("❌ Payment initiation failed:", data.message);
        alert(`Payment initiation failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Payment API Request Failed:", error);
      const message = error.response?.data?.message || "Payment failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="payment-form bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 text-white max-w-md w-full mx-auto">
      <h2 className="text-2xl text-yellow-300 font-bold text-center">Complete Your Payment</h2>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="mt-4 text-center">
            <p className="text-gray-300">
              <strong>Entry Fee:</strong> ₹{amount}
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded shadow hover:bg-yellow-500 transition"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentForm;
