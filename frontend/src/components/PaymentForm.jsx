import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PaymentForm = ({ onClose }) => {
  const [userId, setUserId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [amount, setAmount] = useState(39); // Default entry fee
  const [loading, setLoading] = useState(false); // ✅ Loading for payment initiation

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        Swal.fire("⚠️ Authentication error", "Please log in again.", "warning").then(() => {
          window.location.href = "/login";
        });
        return;
      }

      try {
        console.log("🔍 Fetching user status...");
        const { data } = await axios.get(
          process.env.NODE_ENV === "production"
            ? "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status"
            : "http://localhost:5000/api/auth/user-status",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ User status fetched:", data);

        if (!data?.username) throw new Error("User data not found.");
        setUserId(data.username); // ✅ Keep original logic for setting userId
        setPaymentStatus(data.paymentStatus); // ✅ Capture payment status
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data?.message || error.message);
        Swal.fire("❌ Error", "Authentication error. Please log in again.", "error").then(() => {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        });
      }
    };

    fetchUser();
  }, []);

  const handlePayment = async () => {
    if (loading) return; // ✅ Prevent multiple clicks
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!userId || !token) {
      Swal.fire("⚠️ Authentication error", "Please log in again.", "warning");
      setLoading(false);
      return;
    }

    if (paymentStatus === "SUCCESS") {
      Swal.fire({
        icon: "info",
        title: "You have already paid ✅",
        text: "You don't need to pay again. Payments will reopen on March 14th.",
        confirmButtonColor: "#3085d6",
      });
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
        Swal.fire({
          icon: "success",
          title: "Redirecting to payment page...",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = data.redirectUrl;
        });
      } else {
        Swal.fire("❌ Payment initiation failed", data.message || "Unknown error", "error");
      }
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "You have already paid. Payments will reopen on March 14th.") {
        Swal.fire({
          icon: "info",
          title: "Payment Already Made ✅",
          text: "You have already paid for this challenge. Payments reopen on March 14th.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire("❌ Payment Failed", message || "Please try again.", "error");
      }
    } finally {
      setLoading(false); // ✅ Reset loading state
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
              className={`px-4 py-2 bg-yellow-400 text-black font-bold rounded shadow ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-500"
              } transition`}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentForm;
