/** @format */
import mongoose, { Document } from "mongoose";
export interface IMonthlyInflow {
    month: string;
    amount: number;
}
export interface IStats extends Document {
    totalFunds: number;
    monthlyGrowth: number;
    activeCampaigns: number;
    totalDonors: number;
    targetGoal: number;
    monthlyInflow: IMonthlyInflow[];
    lastUpdated: Date;
}
export declare const Stats: mongoose.Model<IStats, {}, {}, {}, mongoose.Document<unknown, {}, IStats, {}, mongoose.DefaultSchemaOptions> & IStats & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IStats>;
//# sourceMappingURL=Stats.d.ts.map