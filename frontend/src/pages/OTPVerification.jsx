import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { verifyOTP, resendOTP, checkUsernameExists } from "../services/authService";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // ✅ Get email from Signup page
  const username = location.state?.username || "";
const password = location.state?.password || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Verification loading state
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // ⏳ Timer for Resend OTP
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // 🔢 Handle OTP Input Change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only allow one digit
    setOtp(newOtp);

    // Auto-focus to next input
    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // ✅ Handle OTP Submission
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const enteredOtp = otp.join("");
      await verifyOTP(email, enteredOtp, username, password);
      localStorage.setItem("authToken", token); // ✅ Store token in localStorage

    navigate("/dashboard"); // ✅ Redirect to Dashboard after success
      
    } catch (err) {
      setError("Invalid OTP. Try again.");
      setLoading(false);
    }
  };

  // 🔄 Handle Resend OTP
  const handleResendOTP = async () => {
    setCanResend(false);
    setTimer(30);
    try {
      await resendOTP(email);
    } catch (err) {
      setError("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans relative overflow-hidden">
      {/* 🚀 Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>

      {/* ✨ OTP Verification Form */}
      <motion.div
        className="relative bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-10 max-w-md w-full text-center transform transition duration-500 hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🔥 OTP Verification Header */}
        <h2 className="text-5xl font-semibold text-cyan-400 tracking-wide">
          Verify OTP
        </h2>
        <p className="text-lg text-gray-400 mt-2">Enter the 6-digit OTP sent to your email</p>

        {/* 🔢 OTP Input Fields */}
        <div className="flex justify-center gap-3 mt-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength="1"
              className="w-12 h-12 text-2xl text-center bg-gray-800 text-white border-2 border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition-all outline-none rounded-lg"
            />
          ))}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* 🚀 Verify OTP Button with Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-6">
            <motion.div
              className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <p className="text-cyan-300 mt-4 text-lg">Verifying OTP...</p>
          </div>
        ) : (
          <motion.div className="mt-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              label="Verify OTP"
              className="w-full py-3 bg-cyan-500 text-black font-bold rounded-lg shadow-md transform transition duration-300 hover:scale-110 hover:bg-cyan-600"
              onClick={handleVerify}
            />
          </motion.div>
        )}

        {/* 🔄 Resend OTP Section */}
        <div className="mt-6">
          {canResend ? (
            <motion.button
              onClick={handleResendOTP}
              className="text-cyan-400 hover:text-cyan-300 transition text-lg underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resend OTP
            </motion.button>
          ) : (
            <p className="text-gray-400">Resend OTP in {timer}s</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
