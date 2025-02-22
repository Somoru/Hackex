import express from "express";
import { signup, verifyOTP, login, logout, checkUsername, resendOTP, getUserStatus } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/check-username", checkUsername);
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.post("/resend-otp", resendOTP);
router.get("/user-status", authenticateUser, getUserStatus);

export default router;
