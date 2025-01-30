import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Use `true` for port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"HackEx Team" <${process.env.SMTP_USER}>`, // Set "From" email
      to: email,
      subject: "Your OTP for HackEx",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
    console.log("✅ OTP sent successfully to", email);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
};

export const sendWelcomeEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: `"HackEx Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to HackEx!",
      text: "Congratulations! Your account has been verified successfully. Get ready for exciting coding challenges!",
    });
    console.log("✅ Welcome email sent to", email);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};
