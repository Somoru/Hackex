import express from "express";
import { submitCode } from "../controllers/executionController.js";

const router = express.Router();
router.post("/execute", submitCode);

export default router;
