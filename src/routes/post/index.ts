import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  createPost,
  getPostsMe,
  getPosts,
  getPostById,
  updateStatusPost,
  updatePost,
  getPostsByCursor,
} from "../../controllers/post.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  PostInput,
  UpdateStatusPostInput,
} from "../../validations/post/PostInput";
import upload from "../../middlewares/multer.middleware";
const router = Router();
router.use(authMiddleware);

router.post(
  "/create",
  upload.array("post"),
  validateBody(PostInput),
  createPost
);
router.get("/me", getPostsMe);
router.get("/user/:userId", getPosts);

router.patch(
  "/:postId/status",
  validateBody(UpdateStatusPostInput),
  updateStatusPost
);
router.put("/:postId", upload.array("post"), updatePost);
router.get("/cursor", getPostsByCursor);
router.get("/:postId", getPostById);
export default router;
