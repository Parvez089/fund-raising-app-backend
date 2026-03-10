/** @format */

import express from "express";
import {
  getContributions,
  updateContribution,
  deleteContribution,
  bulkDeleteContributions,
} from "../controllers/contributionsController.js";
import { protect } from "../middlewares/protect.js";


const router = express.Router();

router.get("/",           protect, getContributions);
router.put("/:id",        protect, updateContribution);
router.delete("/bulk",    protect, bulkDeleteContributions);
router.delete("/:id",     protect, deleteContribution);

export default router;