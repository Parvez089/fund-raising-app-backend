/** @format */
import mongoose, { Schema, Document } from "mongoose";
const MonthlyInflowSchema = new Schema({
    month: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
}, { _id: false });
const StatsSchema = new Schema({
    totalFunds: { type: Number, required: true, default: 0 },
    monthlyGrowth: { type: Number, required: true, default: 0 },
    activeCampaigns: { type: Number, required: true, default: 0 },
    totalDonors: { type: Number, required: true, default: 0 },
    targetGoal: { type: Number, required: true, default: 250000 },
    monthlyInflow: { type: [MonthlyInflowSchema], default: [] },
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });
export const Stats = mongoose.model("Stats", StatsSchema);
//# sourceMappingURL=Stats.js.map