/** @format */
import { Stats } from "../models/Stats.js";
// ─────────────────────────────────────────────────────
// GET /api/progress
// Public — campaign progress for homepage
// ─────────────────────────────────────────────────────
export const getProgress = async (_req, res) => {
    try {
        const stats = await Stats.findOne();
        if (!stats) {
            res.status(404).json({ message: "Stats not found." });
            return;
        }
        const raised = stats.totalFunds;
        const target = stats.targetGoal;
        const remaining = Math.max(0, target - raised);
        const percent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
        res.status(200).json({
            raised,
            target,
            remaining,
            percent,
            lastUpdated: stats.lastUpdated,
        });
    }
    catch (error) {
        console.error("getProgress error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=progressController.js.map