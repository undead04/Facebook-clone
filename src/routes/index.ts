import express from "express";
import authRoutes from "./auth/index";
import userRoutes from "./user/index";
import friendRoutes from "./friend/index";
const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);
router.use("/api/friend", friendRoutes);
export default router;
