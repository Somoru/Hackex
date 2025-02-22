import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { loginUser } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans relative overflow-hidden">
      {/* 🚀 Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>

      {/* ✨ Login Form */}
      <motion.div
        className="relative bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-10 max-w-md w-full text-center transform transition duration-500 hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🔥 Login Header (Adjusted Font Weight) */}
        <h2 className="text-5xl font-semibold text-cyan-400 tracking-wide">
          Login
        </h2>
        <p className="text-lg text-gray-400 mt-2">
          Enter your credentials below
        </p>

        {/* 📝 Login Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* 🚀 Login Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              label="Login"
              className="w-full py-3 bg-cyan-500 text-black font-bold rounded-lg shadow-md transform transition duration-300 hover:scale-110 hover:bg-cyan-600"
            />
          </motion.div>
        </form>

        {/* 🌀 Signup Redirect */}
        <p className="text-gray-400 mt-6">
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