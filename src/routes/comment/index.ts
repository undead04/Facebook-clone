import { Router } from "express";
import {
  createComment,
  getCommentsByParentId,
  deleteComment,
} from "../../controllers/comment.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.post("/create-comment", createComment);
router.get("/:postId/list-comment", getCommentsByParentId);
router.delete("/delete-comment", deleteComment);
export default router;
