// authService.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => useContext(AuthContext);
/**
 * ✅ Check if a username is available
 */
export const checkUsernameExists = async (username) => {
  try {
    console.log("🔍 Checking username availability:", username);

    const response = await fetch(
      `https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/check-username?username=${username}`,
      { credentials: "include" } // ✅ Include cookies
    );

    const data = await response.json();
    console.log("✅ Username check response:", data);

    if (!response.ok) throw new Error(data.message);
    return data.available;
  } catch (error) {
    console.error("❌ Error checking username:", error);
    throw error;
  }
};

/**
 * 📩 Request OTP for Signup
 */
export const requestOTP = async (username, email, password) => {
  try {
    console.log("🔍 Sending OTP request with data:", { username, email, password });

    const response = await fetch(
      "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include cookies
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await response.json();
    console.log("✅ OTP request response:", data);

    if (!response.ok) throw new Error(data.message);
    return { message: "OTP Sent", expiresIn: data.expiresIn };
  } catch (error) {
    console.error("❌ Error requesting OTP:", error);
    throw error;
  }
};

/**
 * 🔄 Resend OTP
 */
export const resendOTP = async (email) => {
  try {
    console.log("🔍 Resending OTP for:", email);

    const response = await fetch(
      "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/resend-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include cookies
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    console.log("✅ Resend OTP response:", data);

    if (!response.ok) throw new Error(data.message);
    return { message: "OTP Resent", expiresIn: data.expiresIn };
  } catch (error) {
    console.error("❌ Error resending OTP:", error);
    throw error;
  }
};

/**
 * ✅ Verify OTP and register the user
 */
export const verifyOTP = async (email, otp, username, password) => {
  try {
    console.log("🔍 Sending OTP Verification Request:", { email, otp, username, password });

    const response = await fetch(
      "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/verify-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include cookies
        body: JSON.stringify({ email, otp, username, password }),
      }
    );

    const data = await response.json();
    console.log("✅ OTP verification response:", data);

    if (!response.ok) throw new Error(data.message);

    return data.token; // 🔑 Backend sets the cookie; no need to save token manually
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    throw error;
  }
};

/**
 * 🧾 Get User Payment Status
 */
export const getUserStatus = async () => {
  try {
    console.log("🔍 Fetching user status...");

    const response = await fetch(
      "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status",
      {
        method: "GET",
        credentials: "include", // ✅ Include cookies
      }
    );

    if (response.status === 401) {
      console.warn("⚠️ Unauthorized: No valid token.");
      return null; // ✅ Return null to handle unauthenticated users
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user status.");
    }

    const data = await response.json();
    console.log("✅ User status response:", data);

    return data; // ✅ { username, paymentStatus }
  } catch (error) {
    console.error("❌ Error fetching user status:", error);
    return null; // ✅ Return null for error cases
  }
};


/**
 * 🔑 Login User
 */
export const loginUser = async (email, password) => {
  const { login } = useAuth();

  try {
    const response = await fetch("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    login(); // ✅ Update context
    return await response.json();
  } catch (error) {
    console.error("❌ Login Error:", error);
    throw error;
  }
};
