import express from "express";
import { sendCustomEmail } from "../utils/sendEmail.js"; // Adjust path if needed

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await sendCustomEmail(
      process.env.SMTP_USER, // Your email to receive contact form submissions
      `New Contact Form Submission from ${name}`,
      "contact-email.html", // Create this template
      { NAME: name, EMAIL: email, MESSAGE: message }
    );

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default router;
