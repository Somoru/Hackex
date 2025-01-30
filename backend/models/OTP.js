import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    attempts: { type: Number, default: 0 }, // Track failed attempts
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 mins
  });
  

export default mongoose.model("OTP", OTPSchema);
