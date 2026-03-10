/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface IFund extends Document {
  amount:     number;
  campaign:   string;
  donorName:  string;
  donorEmail: string;
  note:       string;
  status:     "success" | "pending" | "flagged";
  createdAt:  Date;
}

const FundSchema = new Schema<IFund>(
  {
    amount:     { type: Number,  required: true },
    campaign:   { type: String,  required: true, trim: true },
    donorName:  { type: String,  default: "Anonymous", trim: true },
    donorEmail: { type: String,  default: "", trim: true },
    note:       { type: String,  default: "" },
    status:     { type: String,  enum: ["success", "pending", "flagged"], default: "success" },
  },
  { timestamps: true, strict: false }
);

export const Fund = mongoose.models.Fund || mongoose.model<IFund>("Fund", FundSchema);