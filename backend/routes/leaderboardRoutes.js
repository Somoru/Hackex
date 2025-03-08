import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// Fetch leaderboard for a specific challenge (if provided) or global leaderboard
router.get("/:challengeName?", getLeaderboard);

export default router;
