import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          // "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/leaderboard"
          "http://localhost:5000/api/leaderboard"
        );

        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const leaderboardData = await response.json();
        setData(leaderboardData);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-[5rem] px-4 md:px-8">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center">🏆 Weekly Leaderboard</h1>

      {loading ? (
        <p className="text-cyan-400 text-lg">Loading...</p>
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          <div className="bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-cyan-400 border-b border-gray-600">
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-6 text-center text-gray-400">
                      No leaderboard data available.
                    </td>
                  </tr>
                ) : (
                  data.map((user, index) => (
                    <tr
                      key={user.username}
                      className={`transition-all hover:scale-[1.02] ${
                        index === 0
                          ? "bg-yellow-500 text-black font-bold"
                          : "bg-gray-700 bg-opacity-40 backdrop-blur-md text-white"
                      }`}
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
