/** @format */

import type { Request, Response } from "express";
import { Stats } from "../models/Stats.js";
import { Admin } from "../models/Admin.js";
import { TargetHistory } from "../models/TargetHistory.js";
import type { AuthRequest } from "../middlewares/protect.js";

// ─────────────────────────────────────────────────────
// GET /api/target
// ─────────────────────────────────────────────────────
export const getTarget = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stats = await Stats.findOne();

    if (!stats) {
      res.status(404).json({ message: "Stats not found." });
      return;
    }

    const remaining = Math.max(0, stats.targetGoal - stats.totalFunds);
    const progressPercent =
      stats.targetGoal > 0
        ? Math.min(100, Math.round((stats.totalFunds / stats.targetGoal) * 100))
        : 0;

    res.status(200).json({
      targetGoal: stats.targetGoal,
      totalFunds: stats.totalFunds,
      remaining,
      progressPercent,
      lastUpdated: stats.lastUpdated,
    });
  } catch (error) {
    console.error("getTarget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────
// PUT /api/target  (protected)
// ─────────────────────────────────────────────────────
export const updateTarget = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { targetGoal, reason, effectiveDate } = req.body;

    if (!targetGoal || isNaN(Number(targetGoal)) || Number(targetGoal) <= 0) {
      res
        .status(400)
        .json({ message: "Please provide a valid target amount." });
      return;
    }

    const stats = await Stats.findOne();
    if (!stats) {
      res.status(404).json({ message: "Stats not found." });
      return;
    }

    const previousAmount = stats.targetGoal;

    // ── Get admin display name (static import, no dynamic) ──
    let displayName = "Admin";
    let initials = "AD";

    if (req.admin?.id) {
      const adminDoc = await Admin.findById(req.admin.id).select("email");
      if (adminDoc?.email) {
        const namePart = adminDoc.email.split("@")[0] ?? "admin";
        displayName =
          namePart.charAt(0).toUpperCase() +
          namePart.slice(1).replace(/[._]/g, " ");
        initials =
          namePart
            .split(/[._]/)
            .map((p: string) => p[0]?.toUpperCase() ?? "")
            .join("")
            .slice(0, 2)
            .toUpperCase() || "AD";
      }
    }

    // ── Save to history ─────────────────────────────
    await TargetHistory.create({
      targetAmount: Number(targetGoal),
      previousAmount,
      changedBy: displayName,
      changedByInitials: initials,
      reason: reason?.trim() || "No reason provided",
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
    });

    // ── Update stats document ───────────────────────
    stats.targetGoal = Number(targetGoal);
    stats.lastUpdated = new Date();
    await stats.save();

    const remaining = Math.max(0, stats.targetGoal - stats.totalFunds);
    const progressPercent = Math.min(
      100,
      Math.round((stats.totalFunds / stats.targetGoal) * 100),
    );

    res.status(200).json({
      message: "Target updated successfully!",
      targetGoal: stats.targetGoal,
      totalFunds: stats.totalFunds,
      remaining,
      progressPercent,
    });
  } catch (error) {
    console.error("updateTarget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────
// GET /api/target/history  (protected)
// ─────────────────────────────────────────────────────
export const getTargetHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      TargetHistory.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      TargetHistory.countDocuments(),
    ]);

    res.status(200).json({
      history,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + history.length < total,
    });
  } catch (error) {
    console.error("getTargetHistory error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────
// GET /api/target/history/csv  (protected)
// ─────────────────────────────────────────────────────
export const downloadHistoryCSV = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const history = await TargetHistory.find().sort({ createdAt: -1 });

    const headers = [
      "Date",
      "Target Amount",
      "Previous Amount",
      "Changed By",
      "Reason",
    ];
    const rows = history.map((h) => [
      new Date(h.effectiveDate).toLocaleDateString("en-US"),
      `$${h.targetAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      `$${h.previousAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      h.changedBy,
      `"${h.reason.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="target-history-${Date.now()}.csv"`,
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("downloadHistoryCSV error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
