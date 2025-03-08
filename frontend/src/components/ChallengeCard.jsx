import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PaymentForm from "./PaymentForm"; // Import Payment Form Component

const ChallengeCard = ({ title, startDate, endDate, entryFee, paymentStatus }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (paymentStatus === "Verified") {
            navigate("/code-execution"); // 🚀 Redirect to coding page if payment is done
        } else {
            setShowPaymentForm(true); // 💰 Show payment form if not paid
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 bg-gray-800 bg-opacity-60 backdrop-blur-lg p-6 rounded-xl shadow-md border border-gray-700 hover:border-cyan-400 transition-all duration-300"
        >
            <h3 className="text-2xl text-yellow-300 font-bold">{title}</h3>
            <p className="text-gray-400 mt-2">"Join now by paying the Entry Fee & compete for top prizes!"</p>

            {/* Date Box */}
            <div className="absolute top-4 right-4 bg-gray-700 bg-opacity-80 text-gray-300 px-3 py-1 rounded-md text-sm">
                📅 {startDate} - {endDate}
            </div>

            {/* Prize Breakdown */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 text-gray-300 text-lg bg-gray-900 p-4 rounded-lg shadow-md"
                    >
                        <p>🏆 <strong>1st Place:</strong> ₹600</p>
                        <p>🥈 <strong>2nd Place:</strong> ₹300</p>
                        <p>🥉 <strong>3rd Place:</strong> ₹180</p>
                        <p className="text-yellow-300 mt-2">💰 <strong>Entry Fee:</strong> {entryFee}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleButtonClick}
                    className={`px-6 py-2 font-bold rounded-lg shadow-md transition duration-300 ${
                        paymentStatus === "Verified"
                            ? "bg-green-500 text-white hover:bg-green-400"
                            : "bg-yellow-500 text-black hover:bg-yellow-400"
                    }`}
                >
                    {paymentStatus === "Verified" ? "🚀 Let's Go" : "💰 Join Now"}
                </button>

                {showPaymentForm && <PaymentForm onClose={() => setShowPaymentForm(false)} />}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "Hide Details" : "View Details"}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ChallengeCard;
