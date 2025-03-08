import Payment from "../models/Payment.js";
import { getCurrentWeek } from "../utils/dateUtils.js";
import axios from "axios";
import dotenv from "dotenv";
import User from "../models/User.js";
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

    console.log("✅ PhonePe Access Token Response:", data); // 🔎 Log full response
    if (!data.access_token) throw new Error("Access token missing.");

    console.log("✅ Access Token Retrieved:", data.access_token); // ✅ Log the token itself
    return data.access_token;
  } catch (err) {
    console.error("❌ Access token error:", err.response?.data || err.message);
    throw new Error("Token generation failed.");
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
  const existingPayment = await Payment.findOne({ userId, week: currentWeek });

  if (existingPayment) {
    if (existingPayment.status === "SUCCESS") {
      throw new Error("You have already paid for this week.");
    } else if (existingPayment.status === "PENDING") {
      throw new Error("Your payment is still being processed.");
    }
  }

  // ✅ Proceed with new payment
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

  const accessToken = await getAccessToken();
  const { data } = await axios.post(
    `${process.env.PHONEPE_BASE_URL}/pg/checkout/v2/pay`,
    payload,
    { headers: { Authorization: `O-Bearer ${accessToken}`, "Content-Type": "application/json" } }
  );

  if (!data.redirectUrl) {
    throw new Error("Payment failed. No redirect URL received.");
  }

  // ✅ Save the payment record
  await Payment.create({
    userId,
    week: currentWeek,
    amount,
    merchantOrderId,
    transactionId: data.transactionId || null,
    status: "PENDING",
  });

  return { success: true, redirectUrl: data.redirectUrl };
};



/**
 * 📝 Update Payment Status (Webhook)
 */


export const updatePaymentStatus = async (merchantOrderId, transactionId, transactionStatus) => {
  console.log("🔄 Updating payment for merchantOrderId:", merchantOrderId);

  const updateFields = {
    status: transactionStatus,
    paymentDate: transactionStatus === "SUCCESS" ? new Date() : undefined,
  };

  if (transactionId) {
    updateFields.transactionId = transactionId;
  }

  const payment = await Payment.findOneAndUpdate(
    { merchantOrderId }, // ✅ Ensure this field matches what's in DB
    updateFields,
    { new: true }
  );

  if (!payment) {
    console.error("❌ No payment found for merchantOrderId:", merchantOrderId);
  }

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