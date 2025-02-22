import { initiatePayment } from "../services/paymentService.js";
import jwt from "jsonwebtoken";

/**
 * 💳 Initiate Payment Handler (using Authorization header)
 */
export const initiatePaymentHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  // ✅ Check for the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token
  } catch (error) {
    console.error("🚫 JWT Verification Failed:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const userId = decodedToken.userId; // ✅ Extract userId from token
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
