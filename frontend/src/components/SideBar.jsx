import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full bg-gray-900 text-white w-64 shadow-lg flex flex-col pt-20">
      <div className="p-6 bg-cyan-900">
        <h1 className="text-2xl font-bold text-cyan-400">HackEx</h1>
      </div>
      <nav className="flex-grow">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-6 py-3 hover:bg-gray-700 ${
              isActive ? "bg-gray-800 text-yellow-400" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `block px-6 py-3 hover:bg-gray-700 ${
              isActive ? "bg-gray-800 text-yellow-400" : ""
            }`
          }
        >
          Leaderboard
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
