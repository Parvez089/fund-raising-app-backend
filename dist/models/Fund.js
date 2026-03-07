/** @format */
import mongoose, { Schema, Document } from "mongoose";
const FundSchema = new Schema({
    amount: { type: Number, required: true },
    campaign: { type: String, required: true },
    donorName: { type: String, default: "Anonymous" },
    donorEmail: { type: String, default: "" },
    note: { type: String, default: "" },
}, { timestamps: true });
export const Fund = mongoose.model("Fund", FundSchema);
//# sourceMappingURL=Fund.js.map