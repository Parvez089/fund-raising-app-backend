/** @format */
import mongoose, { Schema, Document } from "mongoose";
const TargetHistorySchema = new Schema({
    targetAmount: { type: Number, required: true },
    previousAmount: { type: Number, required: true, default: 0 },
    changedBy: { type: String, required: true, default: "Admin" },
    changedByInitials: { type: String, required: true, default: "AD" },
    reason: { type: String, default: "" },
    effectiveDate: { type: Date, default: Date.now },
}, { timestamps: true });
export const TargetHistory = mongoose.model("TargetHistory", TargetHistorySchema);
//# sourceMappingURL=TargetHistory.js.map