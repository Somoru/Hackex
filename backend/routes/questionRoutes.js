import express from "express";
import { fetchQuestion, getNextQuestion } from "../controllers/questionController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

console.log("✅ `questionRoutes.js` Loaded!");

// ✅ Ensure `/next` is defined BEFORE `/:questionId`
router.get("/next", authenticateUser, getNextQuestion);
router.get("/:questionId", fetchQuestion);  // ✅ This must come after `/next`

export default router;
