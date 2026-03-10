/** @format */
import mongoose, { Schema, Document } from "mongoose";
const FundSchema = new Schema({
    amount: { type: Number, required: true },
    campaign: { type: String, required: true, trim: true },
    donorName: { type: String, default: "Anonymous", trim: true },
    donorEmail: { type: String, default: "", trim: true },
    note: { type: String, default: "" },
    status: { type: String, enum: ["success", "pending", "flagged"], default: "success" },
}, { timestamps: true, strict: false });
export const Fund = mongoose.models.Fund || mongoose.model("Fund", FundSchema);
//# sourceMappingURL=Fund.js.map