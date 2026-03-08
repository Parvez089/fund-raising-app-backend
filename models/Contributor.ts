/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface IContributor extends Document {
  name: string;
  amount: number;
  message: string;
  avatarUrl: string;
  campaign: string;
  isAnonymous: boolean;
  createdAt: Date;
}

const ContributorSchema = new Schema<IContributor>(
  {
    name: { type: String, required: true, default: "Anonymous" },
    amount: { type: Number, required: true },
    message: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    campaign: { type: String, default: "" },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Contributor = mongoose.model<IContributor>(
  "Contributor",
  ContributorSchema
);