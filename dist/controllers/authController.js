/** @format */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
// ✅ Cookie options — dynamic based on whether connection is HTTPS
// Mobile Chrome blocks sameSite:"none" on HTTP (requires Secure + HTTPS)
function cookieOptions(req) {
    const isHttps = req.secure ||
        req.headers["x-forwarded-proto"] === "https" ||
        process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isHttps,
        sameSite: (isHttps ? "none" : "lax"),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
    };
}
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required." });
            return;
        }
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions(req));
        res.status(200).json({
            message: "Login successful",
            role: admin.role,
            email: admin.email,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        // ✅ Must use same options as set — especially sameSite/secure must match
        const opts = cookieOptions(req);
        res.clearCookie("token", {
            httpOnly: opts.httpOnly,
            secure: opts.secure,
            sameSite: opts.sameSite,
            path: opts.path,
        });
        res.status(200).json({ message: "Logged out successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
// GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ message: "Not authenticated." });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            res.status(404).json({ message: "Admin not found." });
            return;
        }
        res.status(200).json(admin);
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
//# sourceMappingURL=authController.js.map