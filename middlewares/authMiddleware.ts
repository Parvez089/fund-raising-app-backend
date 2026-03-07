/** @format */

// src/middlewares/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyAdmin = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // token from cookies
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as any;
    req.user = decoded; // user data from token
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};
