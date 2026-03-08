/** @format */
import express from "express";
import { getContributors } from "../controllers/contributorController.js";
const router = express.Router();
// Public — homepage recent contributors
router.get("/", getContributors);
export default router;
//# sourceMappingURL=ContributorRoutes.js.map