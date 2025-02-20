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

// ✅ Improved CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",  // ✅ Local frontend
    "https://hackex.in", // ✅ Production frontend (replace with actual domain)
    "https://www.hackex.in" // ✅ Production frontend (replace with actual domain)
];

app.use(cors({
  origin: "*",  // ✅ Allows all frontend origins (for debugging)
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

// ✅ Log Every Request to Debug Issues
app.use((req, res, next) => {
  console.log(`📡 ${req.method} Request to: ${req.originalUrl}`);
  console.log("🔑 Headers:", req.headers);
  console.log("📦 Body:", req.body);
  next();
});

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("❌ CORS Not Allowed"));
        }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.use(express.json());

// ✅ Debugging Middleware for All Requests
app.use((req, res, next) => {
    console.log(`📡 ${req.method} Request to: ${req.originalUrl}`);
    console.log("🔑 Headers:", req.headers);
    console.log("📦 Body:", req.body);
    next();
});

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/code", executionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/leaderboard", LeaderboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Run every Sunday at 00:00 (Weekly Tasks)
cron.schedule("0 0 * * 0", () => {
  console.log("🔄 Running weekly payment reset...");
});

// ✅ Schedule Token Refresh Every 50 Minutes
cron.schedule("*/50 * * * *", async () => {
  console.log("🔄 Automatically Refreshing Access Token...");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
