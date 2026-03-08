/** @format */
import { Router } from "express";
import { createAdmin } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
const router = Router();
// only super admin can access it.
router.post("/create-admin", verifyAdmin, createAdmin);
export default router;
//# sourceMappingURL=adminRoutes.js.map