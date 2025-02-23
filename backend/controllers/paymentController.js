import { initiatePayment, updatePaymentStatus, getPaymentStatus } from "../services/paymentService.js";
import jwt from "jsonwebtoken";

/**
 * 💳 Initiate Payment Handler (using Authorization header)
 */
export const initiatePaymentHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("🚫 JWT Verification Failed:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const userId = decodedToken.userId;
  const { amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: "User ID and amount are required." });
  }

  try {
    const { success, redirectUrl } = await initiatePayment(userId, amount);
    return success
      ? res.json({ success, redirectUrl })
      : res.status(500).json({ message: "Payment initiation failed." });
  } catch (err) {
    console.error("🔥 Error in initiatePaymentHandler:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * 🔔 Payment Webhook Handler (PhonePe callback)
 */
export const paymentWebhookHandler = async (req, res) => {
  const { merchantOrderId, transactionStatus } = req.body;

  if (!merchantOrderId || !transactionStatus) {
    return res.status(400).json({ message: "Invalid webhook data." });
  }

  try {
    await updatePaymentStatus(merchantOrderId, transactionStatus);
    console.log(`✅ Payment status updated: ${merchantOrderId} -> ${transactionStatus}`);
    res.status(200).json({ message: "Payment status updated." });
  } catch (error) {
    console.error("❌ Webhook handling failed:", error.message);
    res.status(500).json({ message: "Failed to update payment status." });
  }
};

/**
 * 🧾 Get Payment Status Handler
 */
export const getPaymentStatusHandler = async (req, res) => {
  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  try {
    const status = await getPaymentStatus(orderId);
    res.json({ paymentStatus: status });
  } catch (error) {
    console.error("❌ Error fetching payment status:", error.message);
    res.status(500).json({ message: "Failed to fetch payment status." });
  }
};
