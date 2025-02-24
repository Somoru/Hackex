import Payment from "../models/Payment.js";
import { getCurrentWeek } from "../utils/dateUtils.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  PHONEPE_CLIENT_ID,
  PHONEPE_CLIENT_SECRET,
  PHONEPE_BASE_URL,
  FRONTEND_URL,
} = process.env;

/**
 * 🔑 Get Access Token from PhonePe
 */
export const getAccessToken = async () => {
  try {
    const { data } = await axios.post(
      `${PHONEPE_BASE_URL}/identity-manager/v1/oauth/token`,
      new URLSearchParams({
        client_id: PHONEPE_CLIENT_ID,
        client_secret: PHONEPE_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return data.access_token;
  } catch (err) {
    console.error("❌ Access token error:", err.response?.data || err.message);
    throw new Error("Failed to get access token.");
  }
};

/**
 * 💳 Initiate Weekly Payment
 */
export const initiatePayment = async (userId, amount) => {
  const accessToken = await getAccessToken();
  const week = getCurrentWeek();

  // ✅ Check if payment already exists for this week
  const existingPayment = await Payment.findOne({ userId, week });

  if (existingPayment && existingPayment.status === "SUCCESS") {
    throw new Error("Payment already completed for this week.");
  }

  const merchantOrderId = `TXN_${userId}_${Date.now()}`;
  const payload = {
    merchantOrderId,
    amount: amount * 100,
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: `${FRONTEND_URL}/payment-success?orderId=${merchantOrderId}`,
      },
    },
  };

  try {
    const { data } = await axios.post(`${PHONEPE_BASE_URL}/pg/checkout/v2/pay`, payload, {
      headers: { "Content-Type": "application/json", Authorization: `O-Bearer ${accessToken}` },
    });

    if (!data.redirectUrl) throw new Error("Payment initiation failed.");

    // ✅ Create or update the payment record
    await Payment.findOneAndUpdate(
      { userId, week },
      { merchantOrderId, amount, status: "PENDING" },
      { upsert: true, new: true }
    );

    return { success: true, redirectUrl: data.redirectUrl };
  } catch (err) {
    console.error("🔥 Payment initiation error:", err.message);
    throw new Error("Payment initiation failed.");
  }
};

/**
 * 📝 Update Payment Status (Webhook)
 */
export const updatePaymentStatus = async (merchantOrderId, transactionId, status) => {
  const payment = await Payment.findOneAndUpdate(
    { merchantOrderId },
    { status, transactionId, paymentDate: status === "SUCCESS" ? new Date() : null },
    { new: true }
  );

  if (!payment) throw new Error("Payment record not found.");
  return payment;
};

/**
 * 🧾 Get Current Week Payment Status
 */
export const getCurrentWeekPaymentStatus = async (userId) => {
  const week = getCurrentWeek();
  const payment = await Payment.findOne({ userId, week });
  return payment ? payment.status : "PENDING";
};
