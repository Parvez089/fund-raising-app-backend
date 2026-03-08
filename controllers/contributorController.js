/** @format */
import { Contributor } from "../models/Contributor.js";
import { Stats } from "../models/Stats.js";
import { Fund } from "../models/Fund.js";
// ─────────────────────────────────────────────────────
// GET /api/contributors
// Public — recent contributors for homepage
// Query: ?limit=10&page=1
// ─────────────────────────────────────────────────────
export const getContributors = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 10);
        const skip = (page - 1) * limit;
        // Pull from Fund model (the real transaction records)
        const [funds, total] = await Promise.all([
            Fund.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("donorName amount note campaign createdAt"),
            Fund.countDocuments(),
        ]);
        // Shape data for frontend
        const contributors = funds.map((f) => ({
            _id: f._id,
            name: f.donorName || "Anonymous",
            amount: f.amount,
            message: f.note || "",
            campaign: f.campaign || "",
            createdAt: f.createdAt,
            isAnonymous: !f.donorName || f.donorName === "Anonymous",
            // Generate initials for avatar fallback
            initials: (f.donorName || "AN")
                .split(" ")
                .map((n) => n[0]?.toUpperCase() ?? "")
                .join("")
                .slice(0, 2),
        }));
        res.status(200).json({
            contributors,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + contributors.length < total,
        });
    }
    catch (error) {
        console.error("getContributors error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=contributorController.js.map