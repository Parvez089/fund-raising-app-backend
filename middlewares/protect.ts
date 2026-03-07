/** @format */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export interface AuthRequest extends Request {
  admin?: { id: string; role: string };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Not authenticated. Please log in." });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { id: string; role: string };

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      res.status(401).json({ message: "Admin not found." });
      return;
    }

    req.admin = { id: String(admin._id), role: admin.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.admin?.role !== "super_admin") {
    res.status(403).json({ message: "Access denied. Super Admin only." });
    return;
  }
  next();
};