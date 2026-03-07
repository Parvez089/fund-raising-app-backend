/** @format */

import type { Request, Response } from "express";
import { Stats } from "../models/Stats.js";
import { Fund } from "../models/Fund.js";

// ─────────────────────────────────────────
// GET /api/stats
// All 4 dashboard cards + chart data
// ─────────────────────────────────────────
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Stats.findOne();

    if (!stats) {
      res.status(404).json({ message: "Stats not found." });
      return;
    }

    res.status(200).json({
      totalFunds: stats.totalFunds, // Card 1
      monthlyGrowth: stats.monthlyGrowth, // Card 2
      activeCampaigns: stats.activeCampaigns, // Card 3
      totalDonors: stats.totalDonors, // Card 4
      targetGoal: stats.targetGoal, // Progress bar
      monthlyInflow: stats.monthlyInflow, // Chart
      lastUpdated: stats.lastUpdated,
    });
  } catch (error) {
    console.error("getStats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// POST /api/stats/fund
// Add fund → auto updates:
//   totalFunds (Card 1)
//   totalDonors (Card 4)
//   monthlyInflow (Chart)
//   monthlyGrowth (Card 2) — auto calculated
// ─────────────────────────────────────────
export const addFund = async (req: Request, res: Response): Promise<void> => {
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

    // Update stats
    const stats = await Stats.findOne();
    if (!stats) {
      res.status(404).json({ message: "Stats not initialized." });
      return;
    }

    // Update Card 1 & Card 4
    stats.totalFunds += Number(amount);
    stats.totalDonors += 1;
    stats.lastUpdated = new Date();

    // Update chart — current month
    const currentMonth = new Date()
      .toLocaleString("default", { month: "short" })
      .toUpperCase();

    const monthEntry = stats.monthlyInflow.find(
      (m) => m.month === currentMonth,
    );
    if (monthEntry) {
      monthEntry.amount += Number(amount);
    } else {
      stats.monthlyInflow.push({
        month: currentMonth,
        amount: Number(amount),
      });
    }

    // Keep only last 6 months
    if (stats.monthlyInflow.length > 6) {
      stats.monthlyInflow = stats.monthlyInflow.slice(-6);
    }

    // Auto-calculate Card 2: Monthly Growth %
    const inflow = stats.monthlyInflow;
    if (inflow.length >= 2) {
      const prevEntry = inflow[inflow.length - 2];
      const currEntry = inflow[inflow.length - 1];

      // ✅ TypeScript undefined check
      if (prevEntry && currEntry) {
        const prev = prevEntry.amount;
        const curr = currEntry.amount;
        stats.monthlyGrowth =
          prev > 0
            ? Number(Number(((curr - prev) / prev) * 100).toFixed(1))
            : 0;
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
        monthlyInflow: stats.monthlyInflow,
      },
    });
  } catch (error) {
    console.error("addFund error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// PUT /api/stats/target
// Update fundraising target goal
// ─────────────────────────────────────────
export const updateTarget = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { targetGoal } = req.body;

    if (!targetGoal || isNaN(Number(targetGoal)) || Number(targetGoal) <= 0) {
      res.status(400).json({ message: "Please provide a valid target goal." });
      return;
    }

    const stats = await Stats.findOneAndUpdate(
      {},
      { targetGoal: Number(targetGoal), lastUpdated: new Date() },
      { new: true },
    );

    if (!stats) {
      res.status(404).json({ message: "Stats not found." });
      return;
    }

    res.status(200).json({
      message: "Target updated successfully!",
      targetGoal: stats.targetGoal,
    });
  } catch (error) {
    console.error("updateTarget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// PUT /api/stats/campaigns
// Manually update Card 3: Active Campaigns
// ─────────────────────────────────────────
export const updateCampaigns = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { activeCampaigns } = req.body;

    if (activeCampaigns === undefined || isNaN(Number(activeCampaigns))) {
      res.status(400).json({ message: "Please provide a valid number." });
      return;
    }

    const stats = await Stats.findOneAndUpdate(
      {},
      {
        activeCampaigns: Number(activeCampaigns),
        lastUpdated: new Date(),
      },
      { new: true },
    );

    if (!stats) {
      res.status(404).json({ message: "Stats not found." });
      return;
    }

    res.status(200).json({
      message: "Active campaigns updated!",
      activeCampaigns: stats.activeCampaigns,
    });
  } catch (error) {
    console.error("updateCampaigns error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────
// GET /api/stats/transactions
// Paginated transaction history
// ─────────────────────────────────────────
export const getTransactions = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
  } catch (error) {
    console.error("getTransactions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
