import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendOTP, sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

// ✅ Check if username is available
router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required" });

    const userExists = await User.findOne({ username });
    res.json({ available: !userExists });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error in Login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // 🔥 Ensure only one OTP exists per email
    await OTP.deleteOne({ email });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, otp: otpCode });

    await sendOTP(email, otpCode); // ✅ Send only one OTP

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ Error in Signup OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Verify OTP & Register User
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("🔍 Incoming OTP Verification Request:", req.body);

    const { email, otp, username, password } = req.body;

    if (!email || !otp || !username || !password) {
      console.error("❌ Missing Data:", { email, otp, username, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OTP.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    sendWelcomeEmail(email);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ OTP Verified Successfully");
    res.json({ message: "User verified successfully", token });
  } catch (error) {
    console.error("❌ Error in OTP Verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Get User Status (Dashboard)
router.get("/user-status", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ username: user.username, hasPaid: user.hasPaid });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});
export default router;
