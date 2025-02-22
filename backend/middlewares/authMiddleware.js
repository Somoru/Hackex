import jwt from "jsonwebtoken";

/**
 * ✅ Middleware to Authenticate User via JWT
 */
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token from header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach decoded payload
    next();
  } catch (error) {
    console.error("🚫 JWT Verification Failed:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
