/** @format */

import express from "express";
import { getParticipants } from "../controllers/participantController.js";

const router = express.Router();

// Public — participants page
router.get("/", getParticipants);

export default router;