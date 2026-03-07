/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface IFund extends Document {
  amount: number;
  campaign: string;
  donorName?: string;
  donorEmail?: string;
  note?: string;
  createdAt: Date;
}

const FundSchema = new Schema<IFund>(
  {
    amount: { type: Number, required: true },
    campaign: { type: String, required: true },
    donorName: { type: String, default: "Anonymous" },
    donorEmail: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Fund = mongoose.model<IFund>("Fund", FundSchema);