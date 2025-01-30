import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/payment-webhook", async (req, res) => {
    const { paymentStatus, email } = req.body;
  
    if (paymentStatus !== "SUCCESS") {
      return res.status(400).json({ message: "Payment failed or incomplete." });
    }
  
    await User.findOneAndUpdate({ email }, { hasPaid: true });
  
    res.json({ message: "Payment verified successfully" });
  });
  
export default router;
