import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import OTPVerification from "../pages/OTPVerification";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import PrivacyPolicy from "../pages/Privacy-Policy";
import TermsAndConditions from "../pages/TermsAndConditions";
import RefundPolicy from "../pages/RefundPolicy";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar /> {/* ✅ Keep Navbar inside Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* ✅ Catch-All Route (Redirects unknown paths to Home) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
