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
} from "../../controllers/user.controller";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import upload from "../../middlewares/multer.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  updateUserInput,
  changePasswordInput,
} from "../../validations/user/index";
const router = Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.patch("/me", validateBody(updateUserInput), updateMe);
router.patch("/me/avatar", upload.single("avatar"), updateAvatar);
router.patch("/me/cover-photo", upload.single("coverPhoto"), updateCoverPhoto);
router.delete("/me/avatar", deleteAvatar);
router.delete("/me/cover-photo", deleteCoverPhoto);
router.patch("/me/password", validateBody(changePasswordInput), changePassword);
router.get("/search", getUserByName);
router.get("/:userId", getUserById);
export default router;
