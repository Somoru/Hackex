import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const loggedInUser = localStorage.getItem("username");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/leaderboard/Weekly Challenge"
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-20 px-4 md:px-8">
      
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-8 text-center tracking-wide drop-shadow-lg">
        🏆 Weekly Leaderboard
      </h1>

      {/* Scoped Styles (Only applies to this component) */}
      <style>{`
        /* Glass Effect for Leaderboard */
        .leaderboard-glass {
          background: rgba(255, 255, 255, 0.08); /* Light transparent effect */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        /* Gold Fill Animation for Rank 1 */
        .gold-hover {
          background: rgba(255, 255, 255, 0.1); /* Initially glassy */
          transition: background 0.5s ease-in-out;
        }

        .gold-hover:hover {
          background: linear-gradient(90deg, #ffcc00, #ffd700, #ffcc00);
          color: black !important;
          font-weight: bold;
        }

        /* Table Styling */
        tr {
          transition: none !important;
        }
        
        .shadow-custom {
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {loading ? (
        <p className="text-cyan-400 text-lg">Loading...</p>
      ) : (
        <div className="w-full max-w-5xl">
          <div className="leaderboard-glass rounded-xl shadow-custom p-8 border border-gray-600">
            
            {data.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">
                🚀 No leaderboard data available yet. Start coding to claim the top spot!
              </p>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-cyan-400 border-b border-gray-600 text-xl">
                    <th className="px-6 py-3 text-left">Rank</th>
                    <th className="px-6 py-3 text-left">Username</th>
                    <th className="px-6 py-3 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, index) => (
                    <tr
                      key={user.username}
                      className={`text-lg ${
                        user.username === loggedInUser
                          ? "bg-green-500 text-black font-bold shadow-md" // ✅ Highlight logged-in user
                          : index === 0
                          ? "gold-hover text-white font-bold shadow-lg" // 🥇 Gold Fill Animation on Hover
                          : index === 1
                          ? "bg-gray-400 text-black font-bold shadow-md" // 🥈 Silver
                          : index === 2
                          ? "bg-orange-500 text-black font-bold shadow-md" // 🥉 Bronze
                          : "bg-gray-700 bg-opacity-40 backdrop-blur-md text-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </td>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
