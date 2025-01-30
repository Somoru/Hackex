import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
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
      localStorage.setItem("authToken", token); // Store JWT token
      navigate("/dashboard"); // Redirect to Dashboard
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      <h2 className="text-4xl font-bold text-cyan-400 mb-6">Login</h2>
      <form className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleSubmit}>
        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
        {error && <p className="text-red-500">{error}</p>}
        <Button label="Login" className="w-full mt-4" />
      </form>
      <p className="text-gray-400 mt-4">
        Don't have an account? <span onClick={() => navigate("/signup")} className="text-cyan-400 cursor-pointer">Signup</span>
      </p>
    </div>
  );
};

export default Login;
