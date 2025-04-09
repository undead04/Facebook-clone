import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  sendVerifyEmail,
} from "../../controllers/auth.controller";
import authMiddleware from "../../middlewares/auth.middlware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/verify-email", verifyEmail);
router.post("/send-verify-email", sendVerifyEmail);
router.use(authMiddleware);
router.post("/logout", logout);

export default router;
