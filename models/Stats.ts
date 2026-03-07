/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface IMonthlyInflow {
  month: string;
  amount: number;
}

export interface IStats extends Document {
  totalFunds: number;       // Card 1: Total Funds
  monthlyGrowth: number;    // Card 2: Monthly Growth %
  activeCampaigns: number;  // Card 3: Active Campaigns
  totalDonors: number;      // Card 4: Total Donors
  targetGoal: number;       // Progress bar target
  monthlyInflow: IMonthlyInflow[]; // Chart data (last 6 months)
  lastUpdated: Date;
}

const MonthlyInflowSchema = new Schema<IMonthlyInflow>(
  {
    month: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const StatsSchema = new Schema<IStats>(
  {
    totalFunds: { type: Number, required: true, default: 0 },
    monthlyGrowth: { type: Number, required: true, default: 0 },
    activeCampaigns: { type: Number, required: true, default: 0 },
    totalDonors: { type: Number, required: true, default: 0 },
    targetGoal: { type: Number, required: true, default: 250000 },
    monthlyInflow: { type: [MonthlyInflowSchema], default: [] },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Stats = mongoose.model<IStats>("Stats", StatsSchema);