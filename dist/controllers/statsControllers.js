/** @format */
import { Stats } from "../models/Stats.js";
import { Fund } from "../models/Fund.js";
// Helper: get or create stats document
const getOrCreateStats = async () => {
    let stats = await Stats.findOne();
    if (!stats) {
        stats = await Stats.create({
            totalFunds: 0,
            monthlyGrowth: 0,
            activeCampaigns: 1,
            totalDonors: 0,
            targetGoal: 500000,
            monthlyInflow: [],
            lastUpdated: new Date(),
        });
    }
    return stats;
};
// ✅ Consistent month label: "Mar 2026" format
function currentMonthLabel() {
    return new Date().toLocaleString("en-US", { month: "short", year: "numeric" });
}
// ✅ Always return 6 months with 0 fill for missing months
function ensure6Months(inflow) {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
        const real = inflow.find((m) => m.month === label);
        return { month: label, amount: real?.amount ?? 0 };
    });
}
// ─────────────────────────────────────────
// GET /api/stats
// ─────────────────────────────────────────
export const getStats = async (_req, res) => {
    try {
        const stats = await getOrCreateStats();
        // Always compute live from Fund collection
        const [aggregateResult, totalDonors] = await Promise.all([
            Fund.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
            Fund.countDocuments(),
        ]);
        const totalFunds = aggregateResult[0]?.total ?? 0;
        // Sync stored values
        stats.totalFunds = totalFunds;
        stats.totalDonors = totalDonors;
        await stats.save();
        res.status(200).json({
            totalFunds,
            monthlyGrowth: stats.monthlyGrowth,
            activeCampaigns: stats.activeCampaigns,
            totalDonors,
            targetGoal: stats.targetGoal,
            monthlyInflow: ensure6Months(stats.monthlyInflow ?? []), // ✅ always 6
            lastUpdated: stats.lastUpdated,
        });
    }
    catch (error) {
        console.error("getStats error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// ─────────────────────────────────────────
// POST /api/stats/fund
// ─────────────────────────────────────────
export const addFund = async (req, res) => {
    try {
        const { amount, campaign, donorName, donorEmail, note } = req.body;
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            res.status(400).json({ message: "Please provide a valid amount." });
            return;
        }
        if (!campaign) {
            res.status(400).json({ message: "Campaign name is required." });
            return;
        }
        // Save transaction
        const fund = await Fund.create({
            amount: Number(amount),
            campaign,
            donorName: donorName || "Anonymous",
            donorEmail: donorEmail || "",
            note: note || "",
        });
        const stats = await getOrCreateStats();
        // Update totals
        stats.totalFunds += Number(amount);
        stats.totalDonors += 1;
        stats.lastUpdated = new Date();
        // ✅ FIX: use consistent "Mar 2026" format (was "MAR" before)
        const monthLabel = currentMonthLabel();
        const existingIndex = stats.monthlyInflow.findIndex((m) => m.month === monthLabel);
        if (existingIndex >= 0) {
            const existingAmount = stats.monthlyInflow[existingIndex]?.amount ?? 0;
            stats.monthlyInflow[existingIndex] = {
                month: monthLabel,
                amount: existingAmount + Number(amount),
            };
        }
        else {
            stats.monthlyInflow.push({ month: monthLabel, amount: Number(amount) });
        }
        // Keep only last 6 months
        if (stats.monthlyInflow.length > 6) {
            stats.monthlyInflow = stats.monthlyInflow.slice(-6);
        }
        stats.markModified("monthlyInflow");
        // Auto-calculate monthly growth %
        const inflow = stats.monthlyInflow;
        if (inflow.length >= 2) {
            const prevEntry = inflow[inflow.length - 2];
            const currEntry = inflow[inflow.length - 1];
            if (prevEntry && currEntry) {
                const prev = prevEntry.amount;
                const curr = currEntry.amount;
                stats.monthlyGrowth =
                    prev > 0 ? Number(((curr - prev) / prev * 100).toFixed(1)) : 0;
            }
        }
        await stats.save();
        res.status(201).json({
            message: "Fund added successfully!",
            fund,
            updatedStats: {
                totalFunds: stats.totalFunds,
                monthlyGrowth: stats.monthlyGrowth,
                totalDonors: stats.totalDonors,
                monthlyInflow: ensure6Months(stats.monthlyInflow),
            },
        });
    }
    catch (error) {
        console.error("addFund error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// ─────────────────────────────────────────
// PUT /api/stats/target
// ─────────────────────────────────────────
export const updateTarget = async (req, res) => {
    try {
        const { targetGoal } = req.body;
        if (!targetGoal || isNaN(Number(targetGoal)) || Number(targetGoal) <= 0) {
            res.status(400).json({ message: "Please provide a valid target goal." });
            return;
        }
        const stats = await Stats.findOneAndUpdate({}, { targetGoal: Number(targetGoal), lastUpdated: new Date() }, { new: true, upsert: true });
        res.status(200).json({
            message: "Target updated successfully!",
            targetGoal: stats.targetGoal,
        });
    }
    catch (error) {
        console.error("updateTarget error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// ─────────────────────────────────────────
// PUT /api/stats/campaigns
// ─────────────────────────────────────────
export const updateCampaigns = async (req, res) => {
    try {
        const { activeCampaigns } = req.body;
        if (activeCampaigns === undefined || isNaN(Number(activeCampaigns))) {
            res.status(400).json({ message: "Please provide a valid number." });
            return;
        }
        const stats = await Stats.findOneAndUpdate({}, { activeCampaigns: Number(activeCampaigns), lastUpdated: new Date() }, { new: true, upsert: true });
        res.status(200).json({
            message: "Active campaigns updated!",
            activeCampaigns: stats.activeCampaigns,
        });
    }
    catch (error) {
        console.error("updateCampaigns error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// ─────────────────────────────────────────
// GET /api/stats/transactions
// ─────────────────────────────────────────
export const getTransactions = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            Fund.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Fund.countDocuments(),
        ]);
        res.status(200).json({
            transactions,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error("getTransactions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=statsControllers.js.map