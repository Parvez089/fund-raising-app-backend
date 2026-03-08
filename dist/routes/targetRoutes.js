/** @format */
import express from "express";
import { getTarget, updateTarget, getTargetHistory, downloadHistoryCSV, } from "../controllers/targetController.js";
import { protect } from "../middlewares/protect.js";
const router = express.Router();
// Public — homepage progress bar
router.get("/", getTarget);
// Protected — dashboard only
router.put("/", protect, updateTarget);
router.get("/history", protect, getTargetHistory);
router.get("/history/csv", protect, downloadHistoryCSV);
export default router;
//# sourceMappingURL=targetRoutes.js.map