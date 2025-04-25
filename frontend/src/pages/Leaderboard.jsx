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
      <br/>
      <br/>
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10 text-center tracking-wide drop-shadow-xl">
        🏆 Weekly Leaderboard
      </h1>

      {loading ? (
        <div className="flex items-center justify-center mt-16">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full max-w-5xl">
          <div className="rounded-xl bg-gray-900/70 backdrop-blur-lg p-8 border border-gray-700 shadow-2xl">
            {data.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">
                🚀 No leaderboard data yet. Be the first to submit a solution and claim the top!
              </p>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-cyan-400 text-xl border-b border-gray-600">
                    <th className="px-6 py-2">Rank</th>
                    <th className="px-6 py-2">Username</th>
                    <th className="px-6 py-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, index) => {
                    const isTopThree = index < 3;
                    const isCurrentUser = user.username === loggedInUser;

                    const rowColor = isCurrentUser
                      ? "bg-green-500 text-black font-bold"
                      : index === 0
                      ? "bg-yellow-300 text-black font-bold"
                      : index === 1
                      ? "bg-gray-300 text-black font-bold"
                      : index === 2
                      ? "bg-orange-400 text-black font-bold"
                      : "bg-gray-800 bg-opacity-40 text-white";

                    const rankSymbol =
                      index === 0
                        ? "1st"
                        : index === 1
                        ? "2nd"
                        : index === 2
                        ? "3rd"
                        : `#${index + 1}`;

                    return (
                      <tr
                        key={user.username}
                        className={`${rowColor} rounded-lg shadow-md hover:shadow-yellow-400/30 transition-all transform hover:scale-[1.015]`}
                      >
                        <td className="px-6 py-3 rounded-l-lg">{rankSymbol}</td>
                        <td className="px-6 py-3">{user.username}</td>
                        <td className="px-6 py-3 rounded-r-lg">{parseFloat(user.score).toFixed(2)}</td>
                      </tr>
                    );
                  })}
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
