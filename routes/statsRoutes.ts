import express from 'express';
import {
  addFund,
  getStats,
  getTransactions,
  updateCampaigns,
  updateTarget,
} from "../controllers/statsControllers.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.get("/", getStats);

router.post("/fund", protect, addFund);
router.put("/target", protect, updateTarget);
router.put("/campaigns", protect, updateCampaigns);
router.get("/transactions", protect, getTransactions);

export default router;