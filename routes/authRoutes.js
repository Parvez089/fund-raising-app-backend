/** @format */
import { Router } from "express";
import { login, getMe, logout } from "../controllers/authController.js";
const router = Router();
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);
export default router;
//# sourceMappingURL=authRoutes.js.map