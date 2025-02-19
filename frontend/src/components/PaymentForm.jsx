import { useState, useEffect } from "react";
import axios from "axios";

const PaymentForm = ({ onClose }) => {
    const [userId, setUserId] = useState(null);
    const [amount, setAmount] = useState(35); // Default entry fee
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("🔍 FetchUser() Started");

                let token = localStorage.getItem("authToken");

                console.log("🛠 Retrieved Token from LocalStorage:", token);

                // ✅ Ensure `Bearer ` is prefixed to the token
                if (token && !token.startsWith("Bearer ")) {
                    console.log("⚠️ Token is missing `Bearer ` prefix. Fixing...");
                    token = `Bearer ${token}`;
                }

                if (!token) {
                    console.error("❌ No token found. Redirecting to login...");
                    alert("You must be logged in to proceed.");
                    window.location.href = "/login";
                    return;
                }

                console.log("📡 Sending API Request to /user-status...");
                
                const response = await axios.get(
                    //"http://localhost:5000/api/auth/user-status", // ✅ Local Development
                    "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status", // ✅ Production
                    {
                        headers: {
                            Authorization: token, // ✅ Ensures correct token format
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("✅ API Response Received:", response);

                if (!response.data || !response.data.userId) {
                    console.error("❌ API Response Does NOT Contain userId! Full Response:", response.data);
                    throw new Error("User ID not found in response.");
                }

                console.log("✅ Setting userId:", response.data.userId);
                setUserId(response.data.userId);

            } catch (error) {
                console.error("❌ Authentication Error Occurred:", error);

                if (error.response) {
                    console.error("🔴 Server Response:", error.response);
                    console.error("🔴 Server Response Data:", error.response.data);
                    console.error("🔴 Server Response Status:", error.response.status);
                    console.error("🔴 Server Response Headers:", error.response.headers);
                } else if (error.request) {
                    console.error("⚠️ Request Sent but No Response Received!", error.request);
                } else {
                    console.error("❌ Unexpected Error:", error.message);
                }

                alert("Authentication error. Please log in again.");
                localStorage.removeItem("authToken"); // ✅ Remove invalid token
                window.location.href = "/login";

            } finally {
                console.log("⏳ FetchUser() Completed. Setting loading to false.");
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!userId) {
          console.error("❌ Attempted Payment Without a Valid User ID!");
          alert("Authentication error. Please log in again.");
          return;
        }
      
        console.log("📡 Initiating Payment for userId:", userId, "Amount:", amount);
      
        try {
          const response = await axios.post(
            "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/payment/initiate-payment",
            { userId, amount },
            {
              headers: {
                Authorization: localStorage.getItem("authToken"),
                "Content-Type": "application/json",
              },
            }
          );
      
          console.log("✅ Payment Initiation Response:", response.data);
      
          if (response.data.success && response.data.redirectUrl) {
            console.log("🔗 Redirecting to Payment Page:", response.data.redirectUrl);
            alert("Redirecting to payment page...");
            window.location.href = response.data.redirectUrl; // ✅ Safe redirect
          } else {
            console.error("❌ Payment initiation failed:", response.data.message);
            alert(`Payment initiation failed: ${response.data.message || "Unknown error"}`);
          }
        } catch (error) {
          console.error("❌ Payment API Request Failed:", error);
      
          const serverMessage = error.response?.data?.message || "Server error. Please try again.";
      
          alert(`Payment failed: ${serverMessage}`);
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
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-gray-300"><strong>Entry Fee:</strong> ₹{amount}</p>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-yellow-400 text-black font-bold rounded shadow hover:bg-yellow-500 transition" onClick={handlePayment}>
                            Pay Now
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentForm;
