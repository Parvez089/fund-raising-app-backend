/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface ITargetHistory extends Document {
  targetAmount: number;
  previousAmount: number;
  changedBy: string;
  changedByInitials: string;
  reason: string;
  effectiveDate: Date;
  createdAt: Date;
}

const TargetHistorySchema = new Schema<ITargetHistory>(
  {
    targetAmount: { type: Number, required: true },
    previousAmount: { type: Number, required: true, default: 0 },
    changedBy: { type: String, required: true, default: "Admin" },
    changedByInitials: { type: String, required: true, default: "AD" },
    reason: { type: String, default: "" },
    effectiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const TargetHistory = mongoose.model<ITargetHistory>(
  "TargetHistory",
  TargetHistorySchema,
);
