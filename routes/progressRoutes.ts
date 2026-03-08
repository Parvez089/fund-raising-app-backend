/** @format */

import express from "express";
import { getProgress } from "../controllers/progressController.js";

const router = express.Router();

// Public — homepage campaign progress
router.get("/", getProgress);

export default router;