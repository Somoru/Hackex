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
  const paymentRecord = await Payment.findOne({ userId, week: currentWeek });

  const restrictionDate = new Date("2025-03-14T00:00:00Z"); 
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

  try {
    const accessToken = await getAccessToken();
    
    console.log("📡 Sending request to PhonePe:", JSON.stringify(payload, null, 2));

    const { data } = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/pg/checkout/v2/pay`,
      payload,
      {
        headers: {
          Authorization: `O-Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ PhonePe API Response:", data);

    if (!data.redirectUrl) {
      console.error("🔥 PhonePe Payment Failed:", data);
      throw new Error(`PhonePe did not return a redirect URL. Response: ${JSON.stringify(data)}`);
    }

    // ✅ Save or update payment record (Ensuring no duplicate `null` transactionId)
    const updatedPayment = await Payment.findOneAndUpdate(
      { userId, week: currentWeek }, // ✅ Ensure lookup consistency
      {
        userId,
        week: currentWeek,
        amount,
        merchantOrderId,
        transactionId: data.transactionId || null, // ✅ Ensure transactionId is stored properly
        status: "PENDING",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Payment record updated in DB:", updatedPayment);

    return {
      success: true,
      redirectUrl: data.redirectUrl,
    };

  } catch (err) {
    console.error("🔥 Payment initiation error:", err.response?.data || err.message);
    throw new Error("Payment initiation failed.");
  }
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