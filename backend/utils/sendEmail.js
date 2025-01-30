import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

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

// Function to read and format HTML email templates
const getEmailTemplate = (filename, replacements) => {
  try {
    let template = fs.readFileSync(path.resolve(`./emails/${filename}`), "utf8");
    Object.keys(replacements).forEach((key) => {
      template = template.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    });
    return template;
  } catch (error) {
    console.error(`❌ Error reading email template: ${filename}`, error);
    return "<p>Error loading email template.</p>";
  }
};

// ✅ Send OTP Email (Styled HTML)
export const sendOTP = async (email, otp) => {
  try {
    const htmlContent = getEmailTemplate("otp-email.html", { OTP: otp });

    await transporter.sendMail({
      from: `"HackEx Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔐 Your OTP for HackEx",
      html: htmlContent,
    });
    console.log("✅ OTP sent successfully to", email);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
};

// ✅ Send Welcome Email (Styled HTML)
export const sendWelcomeEmail = async (email, username) => {
  try {
    const htmlContent = getEmailTemplate("welcome-email.html", { USER: username });

    await transporter.sendMail({
      from: `"HackEx Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🚀 Welcome to HackEx!",
      html: htmlContent,
    });
    console.log("✅ Welcome email sent to", email);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

// ✅ Send Custom Email (Reusable)
export const sendCustomEmail = async (email, subject, htmlTemplate, replacements) => {
  try {
    const htmlContent = getEmailTemplate(htmlTemplate, replacements);

    await transporter.sendMail({
      from: `"HackEx Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });
    console.log(`✅ Custom email sent to ${email}: ${subject}`);
  } catch (error) {
    console.error(`❌ Error sending custom email: ${subject}`, error);
  }
};
