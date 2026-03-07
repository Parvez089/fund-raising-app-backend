/** @format */
import mongoose, { Schema, Document } from "mongoose";
const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["super_admin", "admin"],
        default: "admin",
    },
}, { timestamps: true });
export const Admin = mongoose.model("Admin", AdminSchema);
//# sourceMappingURL=Admin.js.map