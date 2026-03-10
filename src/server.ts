/** @format */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";
import statsRoutes from "../routes/statsRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import targetRoutes from "../routes/targetRoutes.js";
import contributorRoutes from "../routes/ContributorRoutes.js";
import progressRoutes from "../routes/progressRoutes.js";
import participantRoutes from "../routes/participantRoutes.js";
import contributionsRoutes from "../routes/contributionsRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://fund-raising-hatbair.vercel.app",
        "https://fund-raising-lilac.vercel.app",
      ];

      // Allow all vercel preview deployments
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.match(/https:\/\/fund-raising-.*\.vercel\.app/)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// seeding function
const seedSuperAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ role: "super_admin" });
    if (!adminExists) {
      const password = process.env.ADMIN_PASSWORD || "Admin@123";
      const email = process.env.ADMIN_EMAIL || "admin@fundraisebd.org";

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        email: email,
        password: hashedPassword,
        role: "super_admin",
      });

      await newAdmin.save();
      console.log("--- Super Admin seeded successfully ---");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

mongoose
  .connect(process.env.MongoDB_URI || "...")
  .then(async () => {
    console.log("MongoDB Connected");
    console.log("Connected to:", mongoose.connection.name);

    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api/stats", statsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/target", targetRoutes);
app.use("/api/contributors", contributorRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/contributions", contributionsRoutes);