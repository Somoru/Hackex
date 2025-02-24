import express from "express";
import {
  initiatePaymentHandler,
  paymentWebhookHandler,
  getPaymentStatusHandler
} from "../controllers/paymentController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Initiate Payment (Protected Route)
router.post("/initiate", authenticateUser, initiatePaymentHandler);

// ✅ Get Current Week Payment Status (Protected Route)
router.get("/status", authenticateUser, getPaymentStatusHandler);

// ✅ Webhook to Update Payment Status (Public - called by payment provider)
router.post("/webhook", paymentWebhookHandler);

export default router;
