import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState("Checking...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      alert("Invalid payment redirect.");
      navigate("/dashboard");
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const { data } = await axios.get(
          "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/payment/status",
          { params: { orderId } }
        );

        setPaymentStatus(data.paymentStatus || "Unknown");
      } catch (err) {
        console.error("❌ Error fetching payment status:", err);
        setPaymentStatus("Failed");
      }
    };

    fetchPaymentStatus();
  }, [orderId, navigate]);

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Payment Status</h2>
      <p className="text-center text-lg">
        <strong>Status:</strong>{" "}
        <span
          className={`px-3 py-1 rounded-md font-bold ${
            paymentStatus === "SUCCESS"
              ? "bg-green-600 text-white"
              : paymentStatus === "PENDING"
              ? "bg-yellow-500 text-black"
              : "bg-red-500 text-white"
          }`}
        >
          {paymentStatus}
        </span>
      </p>

      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
