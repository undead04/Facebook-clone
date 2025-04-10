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
import { validateBody } from "../../middlewares/validate.middleware";
import {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  SendVerifyEmailInput,
  RefreshTokenInput,
} from "../../validations/auth";

const router = Router();

router.post("/register", validateBody(RegisterInput), register);

router.post("/login", validateBody(LoginInput), login);

router.post("/refresh-token", validateBody(RefreshTokenInput), refreshToken);

router.post("/verify-email", validateBody(VerifyEmailInput), verifyEmail);
router.post(
  "/send-verify-email",
  validateBody(SendVerifyEmailInput),
  sendVerifyEmail
);

router.use(authMiddleware);
router.post("/logout", logout);

export default router;
