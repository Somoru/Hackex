import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authService";
import Button from "../components/Button";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await verifyOTP({ ...state, otp });
      alert("OTP verified successfully!");
      navigate("/dashboard");
    } catch {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(state.email);
      alert("OTP resent successfully!");
    } catch {
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <div className="bg-gray-900 p-10 rounded-2xl max-w-md w-full text-center">
        <h2 className="text-3xl text-cyan-400 mb-4">Verify OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
          required
        />
        <div className="flex justify-between mt-6">
          <Button label="Verify" onClick={handleVerify} className="w-1/2 mr-2" />
          <Button label="Resend OTP" onClick={handleResend} className="w-1/2 ml-2" />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
