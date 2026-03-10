/** @format */
import mongoose, { Document } from "mongoose";
export interface IFund extends Document {
    amount: number;
    campaign: string;
    donorName: string;
    donorEmail: string;
    note: string;
    status: "success" | "pending" | "flagged";
    createdAt: Date;
}
export declare const Fund: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Fund.d.ts.map