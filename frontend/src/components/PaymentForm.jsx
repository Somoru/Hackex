import { useState, useEffect } from "react";
import axios from "axios";

const PaymentForm = ({ onClose }) => {
  const [userId, setUserId] = useState(null);
  const [amount, setAmount] = useState(39); // Default entry fee


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken"); // ✅ Retrieve token inside useEffect

      if (!token) {
        alert("Authentication error. Please log in again.");
        window.location.href = "/login";
        return;
      }

      try {
        console.log("🔍 Fetching user status...");
        const { data } = await axios.get(
          process.env.NODE_ENV === "production"
            ? "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status"
            : "http://localhost:5000/api/auth/user-status",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Use Authorization header
            },
          }
        );

        console.log("✅ User status fetched:", data);

        if (!data?.username) throw new Error("User data not found."); // Adjust based on backend response
        setUserId(data.username); // ✅ Set userId based on available data
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data?.message || error.message);
        alert("Authentication error. Please log in again.");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const [loading, setLoading] = useState(false);

const handlePayment = async () => {
  if (loading) return; // Prevent multiple clicks
  setLoading(true);

  const token = localStorage.getItem("authToken");

  if (!userId || !token) {
    alert("Authentication error. Please log in again.");
    setLoading(false);
    return;
  }

  try {
    console.log("📡 Initiating Payment:", { userId, amount });
    const { data } = await axios.post(
      process.env.NODE_ENV === "production"
        ? "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/payment/initiate"
        : "http://localhost:5000/api/payment/initiate",
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success && data.redirectUrl) {
      alert("✅ Redirecting to payment page...");
      window.location.href = data.redirectUrl;
    } else {
      alert(`❌ Payment initiation failed: ${data.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("❌ Payment API Request Failed:", error.response?.data?.message || error.message);
    alert("Payment failed. Please try again.");
  } finally {
    setLoading(false); // Reset loading state
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
