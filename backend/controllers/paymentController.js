import { initiatePayment, updatePaymentStatus, getCurrentWeekPaymentStatus } from "../services/paymentService.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import payment from "../models/Payment.js";

/**
 * 💳 Initiate Weekly Payment
 */
export const initiatePaymentHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userId } = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ message: "Amount is required." });

    const { success, redirectUrl } = await initiatePayment(userId, amount);
    res.json({ success, redirectUrl });
  } catch (err) {
    console.error("❌ Payment initiation failed:", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

/**
 * 🔔 Webhook to Update Payment Status
 */
export const paymentWebhookHandler = async (req, res) => {
  const { merchantOrderId, transactionId, transactionStatus } = req.body;

  console.log("🔔 Webhook received:");
  console.log("merchantOrderId:", merchantOrderId);
  console.log("transactionId:", transactionId);
  console.log("transactionStatus:", transactionStatus);

  if (!merchantOrderId || !transactionStatus) {
    console.warn("⚠️ Invalid webhook data:", req.body);
    return res.status(400).json({ message: "Invalid webhook data." });
  }

  try {
    // ✅ Update payment record
    const updatedPayment = await updatePaymentStatus(merchantOrderId, transactionId, transactionStatus);

    if (!updatedPayment) {
      console.error("❌ Payment record not found for:", merchantOrderId);
      return res.status(404).json({ message: "Payment record not found." });
    }

    const userId = updatedPayment.userId;
    if (!userId) {
      console.error("❌ User ID not found in payment record.");
      return res.status(400).json({ message: "User ID not found." });
    }

    // ✅ Update the User document with payment status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        paymentStatus: transactionStatus === "SUCCESS" ? "SUCCESS" : "FAILED",
        hasPaid: transactionStatus === "SUCCESS",
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ User not found for userId:", userId);
      return res.status(404).json({ message: "User not found." });
    }

    console.log("✅ Payment and user updated successfully:", updatedPayment, updatedUser);
    res.status(200).json({ message: "Payment status updated.", payment: updatedPayment, user: updatedUser });

  } catch (err) {
    console.error("🔥 Webhook error:", err.stack);
    res.status(500).json({ message: "Failed to update payment status." });
  }
};


/**
 * 🧾 Get Current Week Payment Status
 */
export const getPaymentStatusHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userId } = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const currentDate = new Date();
    const showPendingAfterDate = new Date("2025-03-12T00:00:00Z"); // ✅ Replace with March 12th

    let status = await getCurrentWeekPaymentStatus(userId);

    // ✅ Override "Pending" with "Not Applicable" before March 12th
    if (status === "PENDING" && currentDate < showPendingAfterDate) {
      status = "Not Applicable";
    }

    res.json({ paymentStatus: status });
  } catch (err) {
    console.error("❌ Error fetching payment status:", err.message);
    res.status(500).json({ message: "Failed to fetch payment status." });
  }
};
