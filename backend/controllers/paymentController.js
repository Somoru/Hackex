import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { createPayment } from "../services/paymentService.js";

export const initiatePayment = async (req, res) => {
    try {
        console.log("📡 Received Payment Initiation Request:", req.body);

        const { userId, amount } = req.body;

        if (!userId || !amount) {
            console.error("❌ Missing required fields: userId or amount");
            return res.status(400).json({ message: "Missing required fields" });
        }

        const paymentResponse = await createPayment(userId, amount);

        console.log("✅ Payment API Response:", paymentResponse);

        if (!paymentResponse.success || !paymentResponse.redirectUrl) {
            console.error("❌ Payment initiation failed:", paymentResponse.message);
            return res.status(400).json({ message: "Payment initiation failed", error: paymentResponse.message });
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
