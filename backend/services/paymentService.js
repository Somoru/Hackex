import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  PHONEPE_CLIENT_ID,
  PHONEPE_CLIENT_SECRET,
  PHONEPE_MERCHANT_ID,
  PHONEPE_BASE_URL,
  FRONTEND_URL
} = process.env;

/**
 * 🔑 Get Access Token from PhonePe
 */
export const getAccessToken = async () => {
  const tokenUrl = `${PHONEPE_BASE_URL}/v1/oauth/token`;
  const payload = new URLSearchParams({
    client_id: PHONEPE_CLIENT_ID,
    client_secret: PHONEPE_CLIENT_SECRET,
    grant_type: "client_credentials"
  });

  try {
    const { data } = await axios.post(tokenUrl, payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    console.log("✅ Access Token Obtained");
    return data.access_token;
  } catch (err) {
    console.error("❌ Failed to get access token:", err.response?.data || err.message);
    throw new Error("Authorization failed");
  }
};

/**
 * 💳 Initiate a Payment using PhonePe Standard Checkout V2
 */
export const createPayment = async (userId, amount) => {
  try {
    const accessToken = await getAccessToken();
    const transactionId = `TXN_${userId}_${Date.now()}`;
    const apiEndpoint = "/checkout/v2/pay";

    const payload = {
      merchantOrderId: transactionId,
      amount: amount * 100,  // Amount in paise
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "HackEx Payment Request",
        merchantUrls: {
          redirectUrl: `${FRONTEND_URL}/payment-success?txnId=${transactionId}`
        }
      }
    };

    console.log("📡 Sending Payment Request to PhonePe...");
    console.log("🔹 Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(`${PHONEPE_BASE_URL}${apiEndpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`
      }
    });

    console.log("✅ PhonePe API Response:", response.data);

    return {
      success: response.data.success,
      transactionId,
      redirectUrl: response.data?.data?.instrumentResponse?.redirectInfo?.url || null
    };
  } catch (err) {
    console.error("❌ PhonePe API Error:", err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || "Payment initiation failed" };
  }
};
