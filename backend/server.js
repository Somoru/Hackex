import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contact.js";
import executionRoutes from "./routes/executionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js"; 
import cron from "node-cron";
import cookieParser from "cookie-parser";
import submissionRoutes from "./routes/submissionRoutes.js";

dotenv.config();
const app = express();
connectDB(); // ✅ Connect to MongoDB

// ✅ Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://hackex.in",
  "https://www.hackex.in"
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
  credentials: true,          
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200   
};

// ✅ Apply Middlewares
app.use(cookieParser());       
app.use(cors(corsOptions));    
app.use(express.json());       

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  console.log("🔑 Headers:", req.headers);
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/code", executionRoutes);
app.use("/api/questions", questionRoutes); // ✅ Ensures question route works
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/submissions", submissionRoutes);

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 🕒 CRON Jobs (For Background Tasks)
cron.schedule("0 0 * * 0", () => console.log("🔄 Weekly payment reset running..."));
cron.schedule("*/50 * * * *", () => console.log("🔄 Refreshing access token..."));

app.get("/", (req, res) => {
  res.status(200).send("✅ Server is running.");
});

// 🚀 Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
