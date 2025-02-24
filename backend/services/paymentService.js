import Payment from "../models/Payment.js";
import { getCurrentWeek } from "../utils/dateUtils.js";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID.");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");

  const currentWeek = getCurrentWeek();
  const paymentRecord = await Payment.findOne({ userId, week: currentWeek });

  const restrictionDate = new Date("2025-03-14T00:00:00Z"); // 🚫 Restrict until March 14th
  const now = new Date();

  if (paymentRecord?.status === "SUCCESS" && now < restrictionDate) {
    throw new Error("You have already paid. Payments will reopen on March 14th.");
  }

  const merchantOrderId = `TXN_${userId}_${Date.now()}`;
  const payload = {
    merchantOrderId,
    amount: amount * 100,
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: `${process.env.FRONTEND_URL}/payment-success?orderId=${merchantOrderId}`,
      },
    },
  };

  // ✅ Save or update payment record
  await Payment.findOneAndUpdate(
    { userId, week: currentWeek },
    { merchantOrderId, amount, status: "PENDING" },
    { upsert: true, new: true }
  );

  return { success: true, redirectUrl: `${process.env.FRONTEND_URL}/payment-success?orderId=${merchantOrderId}` };
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
