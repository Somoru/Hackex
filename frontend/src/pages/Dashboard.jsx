import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/signup"); // Redirect if not logged in
      return;
    }

    fetch("http://localhost:5000/api/auth/user-status", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.username); // ✅ Set username dynamically
        setHasPaid(data.hasPaid);
        setLoading(false); // ✅ Stop loading
      })
      .catch(() => {
        navigate("/signup");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      {/* ✅ Display "Loading..." until username is loaded */}
      <h2 className="text-4xl font-bold text-cyan-400 mb-6">
        {loading ? "Loading..." : `Welcome ${user}! 🚀`}
      </h2>

      {!hasPaid ? (
        <>
          <p className="text-lg text-gray-300 mb-4">Complete payment to access the competition.</p>
          <Button label="Pay ₹35" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => alert("Payment Gateway Coming Soon!")} />
        </>
      ) : (
        <p className="text-lg text-green-400">✅ Payment Completed! Stay tuned for competition dates.</p>
      )}
    </div>
  );
};

export default Dashboard;
