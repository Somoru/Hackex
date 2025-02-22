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
  const tokenUrl = `${PHONEPE_BASE_URL}/identity-manager/v1/oauth/token`;

  try {
    const { data } = await axios.post(tokenUrl, new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: "client_credentials",
    }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    return data.access_token;
  } catch (err) {
    console.error("❌ Failed to get access token:", err.response?.data || err.message);
    throw new Error("Token generation failed.");
  }
};

/**
 * 💳 Initiate Payment
 */
export const initiatePayment = async (userId, amount) => {
  const accessToken = await getAccessToken();
  const merchantOrderId = `TXN_${userId}_${Date.now()}`;
  const apiEndpoint = "/pg/checkout/v2/pay";

  const payload = {
    merchantOrderId,
    amount: amount * 100, // Amount in paise
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "HackEx Payment Request",
      merchantUrls: {
        redirectUrl: `${FRONTEND_URL}/payment-success?orderId=${merchantOrderId}`,
      },
    },
  };

  try {
    const { data } = await axios.post(`${PHONEPE_BASE_URL}${apiEndpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`,
      },
    });

    if (!data.redirectUrl) {
      console.error("🔥 Payment Failed:", data);
      throw new Error(data.message || "Payment initiation failed.");
    }

    return { success: true, redirectUrl: data.redirectUrl };
  } catch (err) {
    console.error("🔥 Payment API Error:", err.response?.data || err.message);
    throw new Error("Payment initiation failed.");
  }
};
