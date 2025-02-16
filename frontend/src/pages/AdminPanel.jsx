import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                window.location.href = "/admin/login"; // Redirect to login if no token
                return;
            }

            const response = await axios.get("https://hackex.in/api/payment/admin/pending-payments", {
                headers: { Authorization: `Bearer ${token}` } // ✅ Include Token
            });

            setPendingPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching payments:", error);
            setLoading(false);
        }
    };

    const updatePayment = async (transactionID, status) => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) return;

            await axios.post("https://hackex.in/api/payment/admin/update-payment", 
                { transactionID, status }, 
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Include Token
            );

            setPendingPayments(pendingPayments.filter(payment => payment.transactionID !== transactionID));
        } catch (error) {
            console.error("❌ Error updating payment status:", error);
        }
    };

    // ✅ Add Logout Button
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 pt-24">
            <div className="w-full flex justify-between items-center max-w-4xl">
                <h1 className="text-3xl font-bold text-cyan-400">Admin Panel - Payment Verification</h1>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleLogout}>
                    Logout 🚪
                </button>
            </div>

            {loading ? (
                <p className="mt-6 text-yellow-400">Loading pending payments...</p>
            ) : pendingPayments.length === 0 ? (
                <p className="mt-6 text-green-400">No pending payments 🎉</p>
            ) : (
                <div className="w-full max-w-4xl mt-6">
                    {pendingPayments.map(payment => (
                        <div key={payment.transactionID} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                            <p><strong>User:</strong> {payment.username}</p>
                            <p><strong>Transaction ID:</strong> {payment.transactionID}</p>
                            <p><strong>Status:</strong> <span className="text-yellow-400">Pending</span></p>
                            
                            {payment.screenshotURL ? (
                                <img src={payment.screenshotURL} alt="Payment Screenshot" className="mt-2 rounded-md w-full max-w-xs" />
                            ) : (
                                <p className="text-red-400 mt-2">Screenshot not available</p>
                            )}

                            <div className="flex gap-4 mt-4">
                                <button 
                                    className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
                                    onClick={() => updatePayment(payment.transactionID, "Verified")}
                                >
                                    ✅ Approve
                                </button>
                                <button 
                                    className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
                                    onClick={() => updatePayment(payment.transactionID, "Rejected")}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
