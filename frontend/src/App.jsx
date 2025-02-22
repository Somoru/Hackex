import React from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext"; // ✅ Import named export
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
