// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getUserStatus } from "../services/authService";

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userStatus = await getUserStatus();
        setIsAuthenticated(!!userStatus); // ✅ If userStatus exists, user is authenticated
      } catch {
        setIsAuthenticated(false); // 🚫 Unauthorized or no token
      }
    };

    checkAuth();
  }, []);

  const login = () => setIsAuthenticated(true);   // ✅ Call after successful login/signup
  const logout = () => setIsAuthenticated(false); // ✅ Call after logout

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
