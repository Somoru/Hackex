import express from "express";
import { initiatePaymentHandler, orderStatusHandler } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePaymentHandler);     // 🚀 Initiate payment
router.get("/status/:orderId", orderStatusHandler);  // 📊 Check order status

export default router;
