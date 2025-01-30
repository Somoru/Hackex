import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { checkUsernameExists, requestOTP, verifyOTP } from "../services/authService";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [otp, setOtp] = useState(""); // Store OTP separately
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
      await requestOTP(formData.username, formData.email, formData.password);
      setStep(2); // Move to OTP step
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
  
    console.log("🔍 OTP Verification Input:", {
      email: formData.email,
      otp,
      username: formData.username,
      password: formData.password,
    });
  
    try {
      const token = await verifyOTP(formData.email, otp, formData.username, formData.password);
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid OTP. Try again.");
      console.error("❌ OTP Verification Error:", err);
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      <h2 className="text-4xl font-bold text-cyan-400 mb-6">Signup</h2>

      {step === 1 && (
        <form className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleSignup}>
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
          {usernameAvailable !== null && (
            <p className={usernameAvailable ? "text-green-500" : "text-red-500"}>
              {usernameAvailable ? "✅ Username is available" : "❌ Username already taken"}
            </p>
          )}
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          <InputField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {error && <p className="text-red-500">{error}</p>}
          <Button label="Send OTP" className="w-full mt-4" />
        </form>
      )}

      {step === 2 && (
        <form className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full" onSubmit={handleVerifyOTP}>
          <InputField label="Enter OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          {error && <p className="text-red-500">{error}</p>}
          <Button label="Verify OTP" className="w-full mt-4" />
        </form>
      )}
    </div>
  );
};

export default Signup;
