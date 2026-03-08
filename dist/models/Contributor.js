/** @format */
import mongoose, { Schema, Document } from "mongoose";
const ContributorSchema = new Schema({
    name: { type: String, required: true, default: "Anonymous" },
    amount: { type: Number, required: true },
    message: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    campaign: { type: String, default: "" },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });
export const Contributor = mongoose.model("Contributor", ContributorSchema);
//# sourceMappingURL=Contributor.js.map