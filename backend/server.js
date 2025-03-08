import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import executionRoutes from "./routes/executionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";  // ✅ Ensure this is correct
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectDB();

// ✅ Debugging Logs
console.log("🚀 Server Starting...");
console.log("✅ Connecting to MongoDB...");
console.log("✅ Loading API Routes...");

app.use(cors());
app.use(express.json());

// ✅ Confirm Routes are Registered
console.log("✅ Registering Routes...");
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/code", executionRoutes);
app.use("/api/questions", questionRoutes);  // ✅ Ensure this exists
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
  console.log("✅ Root route hit!");
  res.send("✅ Server is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
