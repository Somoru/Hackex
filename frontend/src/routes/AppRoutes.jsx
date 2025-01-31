import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import OTPVerification from "../pages/OTPVerification";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import PrivacyPolicy from "../pages/Privacy-Policy";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar /> {/* Ensure Navbar is inside Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<Privacy-Policy />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
