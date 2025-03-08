import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import OTPVerification from "../pages/OTPVerification";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import Leaderboard from "../pages/Leaderboard";
import PrivacyPolicy from "../pages/Privacy-Policy";
import TermsAndConditions from "../pages/TermsAndConditions";
import RefundPolicy from "../pages/RefundPolicy";
import AdminPanel from "../pages/AdminPanel";
import AdminLogin from "../pages/AdminLogin";
import PaymentSuccess from "../pages/PaymentSuccess";
import CodeExecution from "../pages/CodeExecution";
const AppRoutes = () => {
  const isAdminAuthenticated = !!localStorage.getItem("adminToken");
  return (
    <Router>
      <Navbar /> {/* ✅ Keep Navbar inside Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={isAdminAuthenticated ? <AdminPanel /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/code-execution" element={<CodeExecution />} />
        {/* ✅ Catch-All Route (Redirects unknown paths to Home) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;