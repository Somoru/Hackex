import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authService";
import Button from "../components/Button";

const OTPVerification = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = await verifyOTP(email, otp);
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <Button onClick={handleVerify} label="Verify OTP" />
      {canResend ? <Button onClick={handleResendOTP} label="Resend OTP" /> : <p>Resend in {timer}s</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default OTPVerification;
