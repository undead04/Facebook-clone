import express from "express";
import authRoutes from "./auth/index";
import userRoutes from "./user/index";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);

export default router;
