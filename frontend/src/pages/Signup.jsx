import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { checkUsernameExists, requestOTP } from "../services/authService";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otpLoading, setOtpLoading] = useState(false); // ✅ Loading state
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "username") {
      const available = await checkUsernameExists(e.target.value);
      setUsernameAvailable(available);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setOtpLoading(true); // ✅ Start loading state
      await requestOTP(formData.username, formData.email, formData.password);
      setOtpLoading(false); // ✅ Stop loading state
      navigate("/otp-verification", { state: { email: formData.email, username: formData.username, password: formData.password } }); // ✅ Pass email for verification
    } catch (err) {
      setOtpLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans relative overflow-hidden">
      {/* 🚀 Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>

      {/* ✨ Signup Form */}
      <motion.div
        className="relative bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-10 max-w-md w-full text-center transform transition duration-500 hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🔥 Signup Header */}
        <h2 className="text-5xl font-semibold text-cyan-400 tracking-wide">
          Signup
        </h2>
        <p className="text-lg text-gray-400 mt-2">Create your account below</p>

        {otpLoading ? ( // ✅ Show Loading Indicator instead of form
          <div className="flex flex-col justify-center items-center py-10">
            <motion.div
              className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <p className="text-cyan-300 mt-4 text-lg">Sending OTP...</p>
          </div>
        ) : (
          <form className="mt-6 space-y-6" onSubmit={handleSignup}>
            {/* 🚀 Username Field */}
            <div className="relative">
              <label className="block text-lg font-semibold text-cyan-300 tracking-wide uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white text-lg rounded-lg border-2 border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition-all outline-none placeholder-gray-500"
                placeholder="Choose a username"
              />
              {usernameAvailable !== null && (
                <p className={usernameAvailable ? "text-green-500 mt-1" : "text-red-500 mt-1"}>
                  {usernameAvailable ? "✅ Username is available" : "❌ Username taken"}
                </p>
              )}
            </div>

            {/* 🚀 Email Field */}
            <div className="relative">
              <label className="block text-lg font-semibold text-cyan-300 tracking-wide uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white text-lg rounded-lg border-2 border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition-all outline-none placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>

            {/* 🚀 Password Field */}
            <div className="relative">
              <label className="block text-lg font-semibold text-purple-300 tracking-wide uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white text-lg rounded-lg border-2 border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
                placeholder="Create a password"
              />
            </div>

            {/* 🚀 Confirm Password Field */}
            <div className="relative">
              <label className="block text-lg font-semibold text-purple-300 tracking-wide uppercase mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white text-lg rounded-lg border-2 border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
                placeholder="Confirm your password"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* 🚀 Signup Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                label="Send OTP"
                className={`w-full py-3 ${
                  otpLoading ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
                } text-black font-bold rounded-lg shadow-md transform transition duration-300`}
                disabled={otpLoading} // ✅ Disable button when loading
              />
            </motion.div>
          </form>
        )}

        {/* 🌀 Login Redirect */}
        <p className="text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 cursor-pointer underline hover:text-cyan-300 transition"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;