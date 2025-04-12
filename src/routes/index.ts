import express from "express";
import authRoutes from "./auth/index";
import userRoutes from "./user/index";
import friendRoutes from "./friend/index";
import postRoutes from "./post/index";
import likeRoutes from "./like/index";
import commentRoutes from "./comment/index";
import notificationRoutes from "./notificaiton/index";
const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);
router.use("/api/friend", friendRoutes);
router.use("/api/post", postRoutes);
router.use("/api/like", likeRoutes);
router.use("/api/comment", commentRoutes);
router.use("/api/notification", notificationRoutes);
export default router;
