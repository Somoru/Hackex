import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL;

export const createPayment = async (userId, amount) => {
    try {
        const transactionId = `TXN_${userId}_${Date.now()}`;
        const payload = {
            merchantId: PHONEPE_MERCHANT_ID,
            transactionId,
            amount: amount * 100, // Convert to paise
            redirectUrl: `${process.env.FRONTEND_URL}/payment-success?txnId=${transactionId}`,
            callbackUrl: `${process.env.BACKEND_URL}/api/payment/webhook`,
            mobileNumber: null,
            paymentInstrument: { type: "UPI_INTENT" },
        };

        const payloadString = JSON.stringify(payload);
        const checksum = crypto.createHash("sha256").update(payloadString + PHONEPE_SALT_KEY).digest("hex");
        const xVerify = `${checksum}###${PHONEPE_SALT_INDEX}`;

        const response = await axios.post(PHONEPE_BASE_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": xVerify,
            },
        });

        return {
            success: true,
            transactionId,
            redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
        };
    } catch (error) {
        console.error("❌ PhonePe API error:", error.response?.data || error.message);
        return { success: false, message: "Payment initiation failed" };
    }
};
