/** @format */

import type { Request, Response } from "express";
import { Fund } from "../models/Fund.js";

// ─────────────────────────────────────────────────────
// Badge Rules:
// amount <= 5000          → RECENT CONTRIBUTOR
// amount 5001 – 9999      → ACTIVE MEMBER
// amount 10000 – 49999    → TOP CONTRIBUTOR
// amount 50000 – 99999    → GOLD DONOR
// amount >= 100000        → PLATINUM DONOR
// ─────────────────────────────────────────────────────
function getBadge(amount: number): string {
  if (amount >= 100000) return "PLATINUM DONOR";
  if (amount >= 50000)  return "GOLD DONOR";
  if (amount >= 10000)  return "TOP CONTRIBUTOR";
  if (amount >= 5001)   return "ACTIVE MEMBER";
  return "RECENT CONTRIBUTOR";
}

// ─────────────────────────────────────────────────────
// GET /api/participants
// ─────────────────────────────────────────────────────
export const getParticipants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page  = Math.max(1,  Number(req.query.page)  || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip  = (page - 1) * limit;
    const filter = (req.query.filter as string) || "all";
    const search = (req.query.search as string) || "";

    // Build MongoDB query
    const query: Record<string, unknown> = {};

    if (search) {
      query.donorName = { $regex: search, $options: "i" };
    }

    // Top filter — only show amount >= 10000
    if (filter === "top") {
      query.amount = { $gte: 10000 };
    }

    // Sort
    const sort: Record<string, 1 | -1> =
      filter === "top" ? { amount: -1 } : { createdAt: -1 };

    const [funds, total] = await Promise.all([
      Fund.find(query).sort(sort).skip(skip).limit(limit),
      Fund.countDocuments(query),
    ]);

    const participants = funds.map((f) => {
      const amount = f.amount ?? 0;
      const badge  = getBadge(amount);
      const name   = f.donorName?.trim() || "Anonymous";

      const initials = name
        .split(" ")
        .map((n: string) => n[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2) || "AN";

      return {
        _id:         f._id,
        name,
        amount,
        campaign:    f.campaign  || "",
        note:        f.note      || "",
        badge,
        initials,
        isAnonymous: !f.donorName || f.donorName.trim() === "Anonymous",
        isTop:       amount >= 10000,
        joinedAt:    f.createdAt,
      };
    });

    res.status(200).json({
      participants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + participants.length < total,
    });
  } catch (error) {
    console.error("getParticipants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};