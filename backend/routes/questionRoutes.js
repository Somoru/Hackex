import express from "express";
import { fetchQuestion } from "../controllers/questionController.js";

const router = express.Router();
router.get("/:questionId", fetchQuestion);

export default router;
