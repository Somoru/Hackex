import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 🚀 Import Feather Eye icons
import Button from "../components/Button";
import { loginUser } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginUser(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans relative overflow-hidden">
      {/* 🚀 Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40"></div>
      <div className="absolute inset-0 bg-noise bg-repeat opacity-10"></div>

      {/* ✨ Login Form Container */}
      <motion.div
        className="relative backdrop-blur-lg bg-gray-900/80 border border-gray-700 shadow-2xl rounded-2xl p-10 max-w-md w-full mx-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🔥 Login Header */}
        <h2 className="text-5xl font-bold text-cyan-400 tracking-tight">
          Login
        </h2>
        <p className="text-lg text-gray-400 mt-2">
          Welcome back! Please login to your account
        </p>

        {/* 📝 Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          {/* 🚀 Password Field with View/Hide Icon */}
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
              placeholder="Enter your password"
              required
            />
            {/* Eye Icon */}
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-11 text-gray-400 hover:text-cyan-400 cursor-pointer text-2xl transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* 🚨 Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {error}
            </p>
          )}

          {/* 🚀 Login Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              label="Login"
              className="w-full py-3 mt-2 bg-cyan-500 text-black font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-all"
            />
          </motion.div>
        </form>

        {/* 🌀 Signup Redirect */}
        <p className="text-gray-400 mt-8 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-cyan-400 cursor-pointer underline hover:text-cyan-300 transition"
          >
            Signup
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
