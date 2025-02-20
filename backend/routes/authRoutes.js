import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendOTP, sendWelcomeEmail } from "../utils/sendEmail.js";

dotenv.config();
const router = express.Router();

// ✅ Utility function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * ✅ Check if Username is Available
 */
router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required" });

    const userExists = await User.findOne({ username });
    res.json({ available: !userExists });
  } catch (error) {
    console.error("❌ Error Checking Username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ User Login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Error in Login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ Signup & Send OTP
 */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTP(email, otpCode);

    console.log(`✅ OTP Sent to ${email}: ${otpCode}`);
    res.json({ message: "OTP sent to email", expiresIn: 600 });
  } catch (error) {
    console.error("❌ Error in Signup OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * 🔄 Resend OTP
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTP(email, otpCode);

    console.log(`✅ Resent OTP to ${email}: ${otpCode}`);
    res.json({ message: "OTP resent successfully", expiresIn: 600 });
  } catch (error) {
    console.error("❌ Error Resending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ Verify OTP & Register User
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;
    if (!email || !otp || !username || !password) return res.status(400).json({ message: "All fields are required" });

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) return res.status(400).json({ message: "OTP not found. Please request a new one." });

    console.log(`🔑 Stored OTP: ${otpRecord.otp}, Entered OTP: ${otp}`);

    if (otpRecord.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
      hasPaid: false
    });

    await OTP.deleteMany({ email });
    sendWelcomeEmail(email, username);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ OTP Verified & User Created");
    res.json({ message: "User verified successfully", token });
  } catch (error) {
    console.error("❌ Error in OTP Verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ✅ Middleware to Verify User Authentication
 */
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/**
 * ✅ Get User Status
 */
router.get("/user-status", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ username: user.username, userId: user._id, paymentStatus: user.paymentStatus });
  } catch (error) {
    console.error("🔥 Error in `/user-status`:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * 🔑 Admin Login Route
 */
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (error) {
    console.error("❌ Error in Admin Login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
