/** @format */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import statsRoutes from '../routes/statsRoutes.js';
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for FundRaise BD"))
    .catch((err) => console.error(err));
// Sample Route for Dashboard Stats (Image 2)
app.use('/api/stats', statsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map