import { initiatePayment } from "../services/paymentService.js";

export const initiatePaymentHandler = async (req, res) => {
  const { userId, amount } = req.body;
  console.log("📦 Received Body:", req.body);

  if (!userId || !amount) return res.status(400).json({ message: "User ID and amount are required." });

  try {
    const { success, redirectUrl } = await initiatePayment(userId, amount);
    return success ? res.json({ success, redirectUrl }) : res.status(500).json({ message: "Payment initiation failed." });
  } catch (err) {
    console.error("🔥 Error in initiatePaymentHandler:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * 📊 Order Status Handler
 */
export const orderStatusHandler = async (req, res) => {
  const { orderId } = req.params;

  try {
    const status = await checkOrderStatus(orderId);
    res.json(status);
  } catch (err) {
    console.error("🔥 Order Status Error:", err.message);
    res.status(500).json({ message: "Failed to check payment status." });
  }
};
