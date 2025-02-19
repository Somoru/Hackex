import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const {
  PHONEPE_MERCHANT_ID,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_BASE_URL,
  FRONTEND_URL,
  BACKEND_URL
} = process.env;

export const createPayment = async (userId, amount) => {
  try {
    const transactionId = `TXN_${userId}_${Date.now()}`;
    const apiEndpoint = "pg/v1/pay";  // ✅ Correct endpoint

    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100, // Amount in paise
      redirectUrl: `${FRONTEND_URL}/payment-success?txnId=${transactionId}`,
      callbackUrl: `${BACKEND_URL}/api/payment/webhook`,
      paymentInstrument: { type: "UPI_INTENT" }
    };

    const payloadString = JSON.stringify(payload);
    const dataToHash = payloadString + apiEndpoint + PHONEPE_SALT_KEY;

    const checksum = crypto.createHash("sha256").update(dataToHash).digest("hex");
    const xVerify = `${checksum}###${PHONEPE_SALT_INDEX}`;

    console.log("📡 Sending Payment Request to PhonePe...");
    console.log("🔹 Payload:", JSON.stringify(payload, null, 2));
    console.log("🔹 X-VERIFY:", xVerify);

    const response = await axios.post(`${PHONEPE_BASE_URL}${apiEndpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
    });

    console.log("✅ PhonePe API Response:", response.data);

    return {
      success: response.data.success,
      transactionId,
      redirectUrl: response.data?.data?.instrumentResponse?.redirectInfo?.url || null,
    };
  } catch (error) {
    console.error("❌ PhonePe API Error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Payment initiation failed" };
  }
};
