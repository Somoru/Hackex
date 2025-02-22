import { initiatePayment } from "../services/paymentService.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

/**
 * 💳 Initiate Payment Handler
 */
export const initiatePaymentHandler = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user?.userId; // ✅ Extract userId from authenticated user

  if (!userId || !amount) return res.status(400).json({ message: "User ID and amount are required." });

  try {
    const { success, redirectUrl } = await initiatePayment(userId, amount);
    return success ? res.json({ success, redirectUrl }) : res.status(500).json({ message: "Payment initiation failed." });
  } catch (err) {
    console.error("🔥 Error in initiatePaymentHandler:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
