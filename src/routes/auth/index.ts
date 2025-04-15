import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  sendOTP,
  verifyPassword,
  forgotPassword
} from "../../controllers/auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  RegisterInput,
  LoginInput,
  VerifyOTPInput,
  SendVerifyEmailInput,
  RefreshTokenInput,
  ForgotPasswordInput
} from "../../validations/auth";

const router = Router();

router.post("/register", validateBody(RegisterInput), register);

router.post("/login", validateBody(LoginInput), login);

router.post("/refresh-token", validateBody(RefreshTokenInput), refreshToken);

router.post("/verify-email", validateBody(VerifyOTPInput), verifyEmail);
router.post(
  "/send-otp",
  sendOTP
);

router.post("/verify-password", validateBody(VerifyOTPInput), verifyPassword);
router.post("/forgot-password", validateBody(ForgotPasswordInput), forgotPassword);

router.use(authMiddleware);
router.post("/logout", logout);

export default router;
