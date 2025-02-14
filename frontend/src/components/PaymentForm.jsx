import { useState, useEffect } from "react";
import { initiatePayment } from "../services/paymentService";
import axios from "axios";

const PaymentForm = ({ onClose }) => {
    const [userId, setUserId] = useState(null);
    const [amount, setAmount] = useState(35); // Default entry fee
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    alert("You must be logged in to make a payment.");
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get(
                    "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status !== 200 || !response.data.userId) {
                    throw new Error("User ID not found.");
                }

                setUserId(response.data.userId);
            } catch (error) {
                console.error("❌ Failed to fetch user:", error);
                alert("Authentication error. Please log in again.");
                window.location.href = "/login";
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!userId) {
            alert("Authentication error. Please log in again.");
            return;
        }
        await initiatePayment(userId, amount);
    };

    return (
        <div className="payment-form bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 text-white max-w-md w-full mx-auto">
            <h2 className="text-2xl text-yellow-300 font-bold text-center">Complete Your Payment</h2>

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
        </div>
    );
};

export default PaymentForm;
