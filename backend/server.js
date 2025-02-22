import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contact.js";
import executionRoutes from "./routes/executionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import LeaderboardRoutes from "./routes/leaderboardRoutes.js";
import cron from "node-cron";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectDB(); // ✅ Connect to MongoDB

// ✅ Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:3000",  // 🔍 Local frontend
  "http://localhost:5173",  // 🔍 Vite local frontend
  "https://hackex.in",      // 🌐 Production frontend
  "https://www.hackex.in"   // 🌐 Production with www
];

// ✅ CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS Blocked for origin: ${origin}`);
      callback(new Error("CORS Not Allowed"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,  // ✅ Allow cookies
};
app.use(cookieParser());
// ✅ Apply Middlewares
app.use(cors(corsOptions));            // 🌐 Handle CORS
app.options("*", cors(corsOptions));    // 🌐 Handle preflight requests
app.use(express.json());                // 📦 Parse JSON payloads

// ✅ Request Logger (One Instance Only)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  console.log("🔑 Headers:", req.headers);
  console.log("📦 Body:", req.body);
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/code", executionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/leaderboard", LeaderboardRoutes);

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 🕒 CRON Jobs
cron.schedule("0 0 * * 0", () => console.log("🔄 Weekly payment reset running...")); // Every Sunday at midnight
cron.schedule("*/50 * * * *", () => console.log("🔄 Refreshing access token..."));    // Every 50 minutes

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
