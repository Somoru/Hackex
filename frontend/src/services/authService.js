export const checkUsernameExists = async (username) => {
  try {
    console.log("🔍 Checking username availability:", username);

    const response = await fetch(`https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/check-username?username=${username}`);
    const data = await response.json();

    console.log("✅ Username check response:", data);
    if (!response.ok) throw new Error(data.message);
    
    return data.available;
  } catch (error) {
    console.error("❌ Error checking username:", error);
    throw error;
  }
};

export const requestOTP = async (username, email, password) => {
  try {
    console.log("🔍 Sending OTP request with data:", { username, email, password });

    const response = await fetch("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log("✅ OTP request response:", data);

    if (!response.ok) throw new Error(data.message);

    return { message: "OTP Sent", expiresIn: data.expiresIn }; // Return OTP expiry time from backend
  } catch (error) {
    console.error("❌ Error requesting OTP:", error);
    throw error;
  }
};

export const resendOTP = async (email) => {
  try {
    console.log("🔍 Resending OTP for:", email);

    const response = await fetch("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("✅ Resend OTP response:", data);

    if (!response.ok) throw new Error(data.message);

    return { message: "OTP Resent", expiresIn: data.expiresIn };
  } catch (error) {
    console.error("❌ Error resending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (email, otp, username, password) => {
  try {
    console.log("🔍 Sending OTP Verification Request:", { email, otp, username, password });

    const response = await fetch("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, username, password }),
    });

    const data = await response.json();
    console.log("✅ OTP verification response:", data);

    if (!response.ok) throw new Error(data.message);
    return data.token;
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    throw error;
  }
};

export const getUserStatus = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found.");

    console.log("🔍 Fetching user status...");

    const response = await fetch("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/user-status", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log("✅ User status response:", data);

    if (!response.ok) throw new Error(data.message);
    return data.hasPaid;
  } catch (error) {
    console.error("❌ Error fetching user status:", error);
    return false;
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log("🔍 Sending Login Request:", { email, password });

    const response = await fetch("https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("✅ Login response:", data);

    if (!response.ok) throw new Error(data.message);
    return data.token;
  } catch (error) {
    console.error("❌ Login Error:", error);
    throw error;
  }
};
