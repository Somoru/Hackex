import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-80 text-white shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logo} alt="HackEx Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-cyan-400">
            <Link to="/">HackEx.in</Link>
          </h1>
        </div>

        <div className="flex gap-6 text-lg">
          <Link to="/" className="hover:text-cyan-300">Home</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-cyan-300">Dashboard</Link>
              <button onClick={() => { logout(); navigate("/"); }} className="text-red-400 hover:text-red-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-cyan-300">Login</Link>
              <Link to="/signup" className="hover:text-cyan-300">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
