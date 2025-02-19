// paymentController.js

import { createPayment } from "../services/paymentService.js";

/**
 * 🌐 Initiate Payment Controller
 */
export const initiatePayment = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ success: false, message: "User ID and amount are required." });
  }

  try {
    const paymentResponse = await createPayment(userId, amount);

    if (paymentResponse.success) {
      res.status(200).json(paymentResponse);
    } else {
      res.status(500).json(paymentResponse);
    }
  } catch (err) {
    console.error("❌ initiatePayment Error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * 🔔 Webhook Callback Handler
 */
export const handleWebhook = (req, res) => {
  const webhookData = req.body;
  console.log("🔔 Webhook Received:", JSON.stringify(webhookData, null, 2));

  // TODO: Verify signature and update payment status in your database.

  res.status(200).send("Webhook received");
};
