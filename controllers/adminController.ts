/** @format */

import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";

//define type to handle body
interface CreateAdminRequest {
  email: string;
  password?: string;
  role: "admin" | "super_admin";
}

export const createAdmin = async (
  req: Request<{}, {}, CreateAdminRequest>,
  res: Response,
) => {
  const { email, password, role } = req.body;

  try {
    // 1. validation password check
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // 2. check admin if ago
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role: role || "admin", // default admin 
    });

    await newAdmin.save();

    // 5. Success message
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Failed to create admin" });
  }
};
