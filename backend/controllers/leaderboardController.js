import Submission from "../models/Submission.js";
import User from "../models/User.js";
import NodeCache from "node-cache";

const leaderboardCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

export const getLeaderboard = async (req, res) => {
    try {
        const challengeName = req.params.challengeName || "Weekly Challenge"; // Default to weekly leaderboard

        // ✅ Check if leaderboard is cached
        const cacheKey = `leaderboard_${challengeName}`;
        const cachedLeaderboard = leaderboardCache.get(cacheKey);
        if (cachedLeaderboard) return res.json(cachedLeaderboard);

        // ✅ Fetch leaderboard sorted by total score
        const leaderboard = await Submission.aggregate([
            { $match: { challengeName } },
            { $group: { _id: "$userId", totalScore: { $sum: "$finalScore" }, bestTime: { $min: "$timeTakenSec" } } },
            { $sort: { totalScore: -1, bestTime: 1 } },
            { $limit: 10 }
        ]).allowDiskUse(true);

        if (!leaderboard.length) return res.json([]);

        // ✅ Fetch all usernames in a single query
        const userIds = leaderboard.map(entry => entry._id);
        const users = await User.find({ _id: { $in: userIds } }).select("username");

        const userMap = new Map(users.map(user => [user._id.toString(), user.username]));

        const finalLeaderboard = leaderboard.map(entry => ({
            username: userMap.get(entry._id.toString()) || "Unknown",
            score: entry.totalScore
        }));

        // ✅ Cache the result
        leaderboardCache.set(cacheKey, finalLeaderboard);
        res.json(finalLeaderboard);
    } catch (error) {
        console.error("Leaderboard Fetch Error:", error);
        res.status(500).json({ error: "Error fetching leaderboard" });
    }
};

export const updateLeaderboard = async (userId) => {
    try {
        const totalScore = await Submission.aggregate([
            { $match: { userId: userId } }, // ✅ Find all submissions of the user
            { $group: { _id: null, total: { $sum: "$finalScore" } } } // ✅ Sum all final scores
        ]);

        const newTotalScore = totalScore.length ? totalScore[0].total : 0;

        await Leaderboard.findOneAndUpdate(
            { userId },
            { $set: { totalScore: newTotalScore } }, // ✅ Update with the summed score
            { upsert: true, new: true }
        );

        console.log(`🏆 Updated Leaderboard: User ${userId} now has ${newTotalScore} points.`);
    } catch (error) {
        console.error("❌ Error updating leaderboard:", error.message);
    }
};
