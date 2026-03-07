/** @format */
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ message: "Not authenticated. Please log in." });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            res.status(401).json({ message: "Admin not found." });
            return;
        }
        req.admin = { id: String(admin._id), role: admin.role };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
export const requireSuperAdmin = (req, res, next) => {
    if (req.admin?.role !== "super_admin") {
        res.status(403).json({ message: "Access denied. Super Admin only." });
        return;
    }
    next();
};
//# sourceMappingURL=protect.js.map