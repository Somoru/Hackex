import { createPayment } from "../services/paymentService.js";

/**
 * Initiate a payment
 */
export const initiatePayment = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ success: false, message: "User ID and amount are required." });
  }

  try {
    const paymentResponse = await createPayment(userId, amount);
    if (paymentResponse.success) {
      return res.status(200).json(paymentResponse);
    } else {
      return res.status(500).json(paymentResponse);
    }
  } catch (err) {
    console.error("❌ Error in initiatePayment:", err.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * Handle webhook callback from PhonePe
 */
export const handleWebhook = (req, res) => {
  const webhookData = req.body;
  console.log("🔔 Webhook Received:", JSON.stringify(webhookData, null, 2));

  // TODO: Verify the signature and update payment status in DB.

  res.status(200).send("Webhook received");
};
