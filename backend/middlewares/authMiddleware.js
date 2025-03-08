import jwt from "jsonwebtoken";
import User from "../models/User.js";
/**
 * ✅ Middleware to Authenticate User via JWT
 */

export const authenticateUser = (req, res, next) => {
  console.log("🔑 Middleware Hit: Checking Authentication...");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token found in request.");
      return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ User authenticated:", decoded);

      if (!decoded.userId) {
          console.log("❌ Token is missing `userId` field!");
          return res.status(403).json({ error: "Invalid token structure" });
      }

      req.user = { userId: decoded.userId }; // ✅ Ensure `req.user.userId` is set
      next();
  } catch (error) {
      console.log("❌ Token verification failed:", error.message);
      return res.status(403).json({ error: "Forbidden - Invalid token" });
  }
};



export const ensurePaidUser = async (req, res, next) => {
  try {
      console.log("💰 Checking Payment for User:", req.user.userId);
      const user = await User.findById(req.user.userId);
      if (!user) {
          console.error("❌ User Not Found in Database:", req.user.userId);
          return res.status(404).json({ error: "User not found" });
      }

      if (!user.hasPaid) {
          console.error("🚫 Payment Required for User:", req.user.userId);
          return res.status(403).json({ error: "Payment required to access this feature." });
      }

      console.log("✅ User has paid. Access granted.");
      next();
  } catch (error) {
      console.error("🔥 Payment Check Error:", error.message);
      return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
