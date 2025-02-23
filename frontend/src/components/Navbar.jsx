import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/auth/logout",
        {
          method: "POST",
          credentials: "include", // ✅ Include cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Use Authorization
          },
        }
      );
  
      if (response.ok) {
        logout();             // ✅ Clear frontend auth state
        navigate("/login");   // 🚀 Redirect to login page
      } else {
        const errorData = await response.json();
        console.error("❌ Logout failed:", errorData.message);
        alert(`Logout failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      alert("An error occurred during logout.");
    }
  };
  
  

  // ✅ Detect scroll to apply navbar styles
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="HackEx Logo" className="logo" />
          <h1 className="logo-text">
            <Link to="/">HackEx.in</Link>
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/leaderboard" className="nav-item">Leaderboard</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="nav-item">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        </div>

        <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
          <div className="close-button" onClick={() => setMenuOpen(false)}>✖</div>
          <Link to="/" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Home</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/leaderboard" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Leaderboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mobile-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
