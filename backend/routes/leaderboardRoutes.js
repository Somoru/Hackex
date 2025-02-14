import express from "express";
import Submission from "../models/Submission.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/:challengeId", async (req, res) => {
    try {
        const { challengeId } = req.params;

        // Fetch all users who joined the challenge
        const usersWhoJoined = await User.find({ hasPaid: true }).select("username _id");

        // Fetch scores from the submission database
        const scores = await Submission.aggregate([
            { $match: { challengeId } },
            { $group: { _id: "$userId", totalScore: { $sum: "$finalScore" } } },
            { $sort: { totalScore: -1 } }
        ]);

        // Merge users and scores
        const leaderboard = usersWhoJoined.map(user => {
            const scoreEntry = scores.find(score => score._id.equals(user._id));
            return {
                username: user.username,
                score: scoreEntry ? scoreEntry.totalScore : 0
            };
        });

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

export default router;
