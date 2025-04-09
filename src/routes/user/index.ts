import {
  deleteAvatar,
  deleteCoverPhoto,
  changePassword,
  getMe,
  getUserById,
  getUserByName,
  updateAvatar,
  updateCoverPhoto,
  updateMe,
} from "controllers/user.controller";
import { Router } from "express";
import authMiddleware from "middlewares/auth.middlware";
import upload from "middlewares/multer.middlware";
const router = Router();

router.use(upload.single("avatar"));
router.use(upload.single("coverPhoto"));
router.use(authMiddleware);

router.get("/me", getMe);
router.put("/me", updateMe);
router.put("/me/avatar", updateAvatar);
router.put("/me/cover-photo", updateCoverPhoto);
router.delete("/me/avatar", deleteAvatar);
router.delete("/me/cover-photo", deleteCoverPhoto);
router.put("/me/password", changePassword);
router.get("/:userId", getUserById);
router.get("/search", getUserByName);

export default router;
