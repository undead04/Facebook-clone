import { Router } from "express";
import {
  createLike,
  unlike,
  getListLike,
  getLikeCount,
} from "../../controllers/like.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);
router.post("/create-like", createLike);
router.delete("/unlike", unlike);
router.get("/:postId/list-like", getListLike);
router.get("/:postId/like-count", getLikeCount);
export default router;
