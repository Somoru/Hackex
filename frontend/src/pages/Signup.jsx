import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👁️ Professional icons
import Button from "../components/Button";
import { checkUsernameExists, requestOTP } from "../services/authService";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const navigate = useNavigate();

  let timeout;
  const handleChange = (e) => {
    clearTimeout(timeout);
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "username") {
      timeout = setTimeout(async () => {
        const available = await checkUsernameExists(e.target.value);
        setUsernameAvailable(available);
      }, 500); // Debounce for 500ms
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setOtpLoading(true);
      await requestOTP(formData.username, formData.email, formData.password);
      setOtpLoading(false);
      navigate("/otp-verification", { state: { email: formData.email, username: formData.username, password: formData.password } });
    } catch (err) {
      setOtpLoading(false);
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans relative overflow-hidden">
      {/* 🚀 Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40"></div>
      <div className="absolute inset-0 bg-noise bg-repeat opacity-10"></div>

      {/* ✨ Signup Form */}
      <motion.div
        className="relative backdrop-blur-lg bg-gray-900/80 border border-gray-700 shadow-2xl rounded-2xl p-10 max-w-md w-full mx-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🔥 Signup Header */}
        <h2 className="text-5xl font-bold text-cyan-400 tracking-tight">
          Signup
        </h2>
        <p className="text-lg text-gray-400 mt-2">Create your account below</p>

        {otpLoading ? (
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
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            {/* 🚀 Username Field */}
            <div className="text-left">
              <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider uppercase">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 transition-all outline-none text-base"
                placeholder="Choose a username"
                required
              />
              {usernameAvailable !== null && (
                <p className={usernameAvailable ? "text-green-500 mt-1 text-sm" : "text-red-500 mt-1 text-sm"}>
                  {usernameAvailable ? "✅ Username is available" : "❌ Username taken"}
                </p>
              )}
            </div>

            {/* 🚀 Email Field */}
            <div className="text-left">
              <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 transition-all outline-none text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* 🚀 Password Field */}
            <div className="text-left relative">
              <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider uppercase">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 transition-all outline-none text-base"
                placeholder="Create a password"
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-11 text-gray-400 hover:text-cyan-400 cursor-pointer text-2xl transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* 🚀 Confirm Password Field */}
            <div className="text-left relative">
              <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider uppercase">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 transition-all outline-none text-base"
                placeholder="Confirm your password"
                required
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-11 text-gray-400 hover:text-cyan-400 cursor-pointer text-2xl transition"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* 🚨 Error Display */}
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            {/* 🚀 Signup Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                label="Send OTP"
                className={`w-full py-3 ${
                  otpLoading ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
                } text-black font-bold rounded-lg shadow-lg transition-all`}
                disabled={otpLoading}
              />
            </motion.div>
          </form>
        )}

        {/* 🌀 Login Redirect */}
        <p className="text-gray-400 mt-8 text-sm">
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
