import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { createPayment } from "../services/paymentService.js";

export const initiatePayment = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const paymentResponse = await createPayment(userId, amount);
        if (!paymentResponse.success) {
            return res.status(400).json({ message: "Payment initiation failed" });
        }

        res.json({ success: true, redirectUrl: paymentResponse.redirectUrl });
    } catch (error) {
        console.error("❌ Payment initiation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const paymentCallback = async (req, res) => {
    try {
        const { transactionId, status } = req.body;

        if (!transactionId) {
            return res.status(400).json({ message: "Invalid webhook payload" });
        }

        const payment = await Payment.findOne({ transactionID: transactionId });
        if (!payment) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        payment.status = status.toUpperCase();
        await payment.save();

        if (status.toUpperCase() === "SUCCESS") {
            await User.findByIdAndUpdate(payment.userId, { paymentStatus: "SUCCESS" });
        }

        res.json({ success: true, status });
    } catch (error) {
        console.error("❌ Payment callback error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const paymentWebhook = async (req, res) => {
    try {
        const { event, transactionId } = req.body;

        if (!transactionId || !event) {
            return res.status(400).json({ message: "Invalid webhook payload" });
        }

        const payment = await Payment.findOne({ transactionID: transactionId });
        if (!payment) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (event === "pg.order.completed") {
            payment.status = "SUCCESS";
            await User.findByIdAndUpdate(payment.userId, { paymentStatus: "SUCCESS" });
        } else if (event === "pg.order.failed") {
            payment.status = "FAILED";
        } else if (event === "pg.refund.accepted") {
            payment.status = "REFUNDED";
        }

        await payment.save();
        console.log(`✅ Webhook Processed: ${transactionId} - ${event}`);
        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
