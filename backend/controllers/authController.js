import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendOTP, sendWelcomeEmail } from "../utils/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * ✅ Check if Username is Available
 */
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required" });

    const userExists = await User.findOne({ username });
    res.json({ available: !userExists });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ User Signup (OTP is sent)
 */
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    await OTP.findOneAndUpdate({ email }, { otp: otpCode, expiresAt }, { upsert: true });

    await sendOTP(email, otpCode);

    res.json({ message: "OTP sent to email", expiresIn: 300 });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ Verify OTP & Register User
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;
    if (!email || !otp || !username || !password) return res.status(400).json({ message: "All fields are required" });

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.json({ message: "User verified successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ User Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ User Logout
 */
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
