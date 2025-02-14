import express from "express";
import { initiatePayment, paymentCallback, paymentWebhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate-payment", initiatePayment);
router.post("/payment-callback", paymentCallback);
router.post("/webhook", paymentWebhook);

export default router;
