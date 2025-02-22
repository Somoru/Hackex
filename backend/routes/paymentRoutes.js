import express from "express";
import { initiatePaymentHandler } from "../controllers/paymentController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/initiate", authenticateUser, initiatePaymentHandler); // ✅ Protected route

export default router;
