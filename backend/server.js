import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contact.js";
import executionRoutes from "./routes/executionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import cron from "node-cron";
import LeaderboardRoutes from "./routes/leaderboardRoutes.js";


dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/code", executionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/leaderboard", LeaderboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Run every Sunday at 00:00
cron.schedule("0 0 * * 0", () => {
  console.log("🔄 Running weekly payment reset...");
});

// Schedule Token Refresh Every 50 Minutes
cron.schedule("*/50 * * * *", async () => {
  console.log("🔄 Automatically Refreshing Access Token...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
