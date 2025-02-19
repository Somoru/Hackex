import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  PHONEPE_CLIENT_ID,
  PHONEPE_CLIENT_SECRET,
  PHONEPE_BASE_URL,
  PHONEPE_MERCHANT_ID,
  FRONTEND_URL,
} = process.env;

/**
 * 🔑 Get Access Token from PhonePe (V2 Flow)
 */
const getAccessToken = async () => {
  try {
    const tokenUrl = `${PHONEPE_BASE_URL}/v3/authorize`;  // Use V2/V3 auth endpoint
    const payload = new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: "client_credentials",
    });

    const { data } = await axios.post(tokenUrl, payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("✅ Access Token:", data.access_token);
    return data.access_token;
  } catch (err) {
    console.error("❌ Failed to get access token:", err.response?.data || err.message);
    throw new Error("PhonePe authorization failed");
  }
};

/**
 * 💳 Initiate Payment with PhonePe Standard Checkout V2
 */
export const createPayment = async (userId, amount) => {
  try {
    const accessToken = await getAccessToken();
    const transactionId = `TXN_${userId}_${Date.now()}`;
    const apiEndpoint = "/checkout/v2/pay";

    const payload = {
      merchantOrderId: transactionId,
      amount: amount * 100, // Amount in paise
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "HackEx Payment Request",
        merchantUrls: {
          redirectUrl: `${FRONTEND_URL}/payment-success?txnId=${transactionId}`,
        },
      },
    };

    console.log("📡 Sending Payment Request...");
    console.log("🔹 Payload:", payload);

    const response = await axios.post(`${PHONEPE_BASE_URL}${apiEndpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ V2 requires Bearer token
      },
    });

    console.log("✅ PhonePe API Response:", response.data);

    const redirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrl) {
      return { success: false, message: "Redirect URL not found in response." };
    }

    return {
      success: true,
      transactionId,
      redirectUrl,
    };
  } catch (err) {
    console.error("❌ Payment initiation failed:", err.response?.data || err.message);
    return { success: false, message: "Payment initiation failed" };
  }
};
