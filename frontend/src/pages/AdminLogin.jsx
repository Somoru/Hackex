import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/admin/login", {
                username,
                password
            });

            localStorage.setItem("adminToken", response.data.token);
            navigate("/admin");
        } catch (error) {
            setError("❌ Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h2 className="text-3xl font-bold text-yellow-400">Admin Login</h2>
            {error && <p className="text-red-400 mt-2">{error}</p>}
            <input type="text" placeholder="Username" className="mt-4 p-2 bg-gray-800 rounded w-64" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="mt-2 p-2 bg-gray-800 rounded w-64" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="mt-4 px-4 py-2 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-600" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default AdminLogin;
