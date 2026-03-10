/** @format */
import mongoose from "mongoose";
import { Fund } from "../models/Fund.js";
import { Stats } from "../models/Stats.js";
// ── GET /api/contributions ─────────────────────────────
// Query: ?page=1&limit=8&search=&status=all|success|pending|flagged&campaign=
export const getContributions = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 8);
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const status = req.query.status || "all";
        const campaign = req.query.campaign || "";
        const query = {};
        if (search) {
            query.$or = [
                { donorName: { $regex: search, $options: "i" } },
                { campaign: { $regex: search, $options: "i" } },
                { donorEmail: { $regex: search, $options: "i" } },
            ];
        }
        if (campaign)
            query.campaign = { $regex: campaign, $options: "i" };
        if (status !== "all")
            query.status = status;
        const [funds, total] = await Promise.all([
            Fund.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Fund.countDocuments(query),
        ]);
        const contributions = funds.map((f) => ({
            _id: f._id,
            donorName: f.donorName || "Anonymous",
            campaign: f.campaign || "—",
            amount: f.amount,
            status: f.status || "success",
            note: f.note || "",
            createdAt: f.createdAt,
            initials: (f.donorName || "AN")
                .split(" ")
                .map((n) => n[0]?.toUpperCase() ?? "")
                .join("")
                .slice(0, 2),
        }));
        res.status(200).json({
            contributions,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (err) {
        console.error("getContributions error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
// ── PUT /api/contributions/:id ─────────────────────────
export const updateContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const { donorName, campaign, amount, status, note, createdAt } = req.body;
        // Parse and validate incoming date
        let parsedDate = null;
        if (createdAt) {
            const d = new Date(createdAt);
            if (!isNaN(d.getTime()))
                parsedDate = d;
        }
        // ✅ Use native MongoDB driver to bypass Mongoose immutable timestamps.
        // findByIdAndUpdate silently ignores createdAt even with {strict:false}.
        await Fund.collection.updateOne({ _id: new mongoose.Types.ObjectId(id) }, {
            $set: {
                donorName,
                campaign,
                amount: Number(amount),
                status,
                note,
                updatedAt: new Date(),
                ...(parsedDate && { createdAt: parsedDate }),
            },
        });
        const fund = await Fund.findById(id);
        if (!fund) {
            res.status(404).json({ message: "Contribution not found." });
            return;
        }
        res.status(200).json({ message: "Updated successfully.", fund });
    }
    catch (err) {
        console.error("updateContribution error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
// ── DELETE /api/contributions/:id ──────────────────────
export const deleteContribution = async (req, res) => {
    try {
        const { id } = req.params;
        const fund = await Fund.findByIdAndDelete(id);
        if (!fund) {
            res.status(404).json({ message: "Contribution not found." });
            return;
        }
        // Sync stats
        const stats = await Stats.findOne();
        if (stats) {
            stats.totalFunds = Math.max(0, stats.totalFunds - fund.amount);
            stats.totalDonors = Math.max(0, stats.totalDonors - 1);
            stats.lastUpdated = new Date();
            await stats.save();
        }
        res.status(200).json({ message: "Deleted successfully." });
    }
    catch (err) {
        console.error("deleteContribution error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
// ── DELETE /api/contributions/bulk ────────────────────
export const bulkDeleteContributions = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ message: "No IDs provided." });
            return;
        }
        const funds = await Fund.find({ _id: { $in: ids } });
        const totalAmount = funds.reduce((sum, f) => sum + f.amount, 0);
        await Fund.deleteMany({ _id: { $in: ids } });
        const stats = await Stats.findOne();
        if (stats) {
            stats.totalFunds = Math.max(0, stats.totalFunds - totalAmount);
            stats.totalDonors = Math.max(0, stats.totalDonors - ids.length);
            stats.lastUpdated = new Date();
            await stats.save();
        }
        res.status(200).json({ message: `${ids.length} contributions deleted.` });
    }
    catch (err) {
        console.error("bulkDelete error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=contributionsController.js.map