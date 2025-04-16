import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  sendOTP,
  verifyPassword,
  forgotPassword,
} from "../../controllers/auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  RegisterInput,
  LoginInput,
  VerifyOTPInput,
  SendVerifyEmailInput,
  RefreshTokenInput,
  ForgotPasswordInput,
} from "../../validations/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", validateBody(RegisterInput), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", validateBody(LoginInput), login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh-token", validateBody(RefreshTokenInput), refreshToken);

/**
 * @swagger
 * /api/v1/auth/send-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - typeOTP
 *             properties:
 *               email:
 *                 type: string
 *               typeOTP:
 *                 type: string
 *                 enum: [register, forgotPassword]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-otp", sendOTP);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify-email", validateBody(VerifyOTPInput), verifyEmail);

/**
 * @swagger
 * /api/v1/auth/verify-password:
 *   post:
 *     tags: [Auth]
 *     summary: Verify password with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password verified successfully
 */
router.post("/verify-password", validateBody(VerifyOTPInput), verifyPassword);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post(
  "/forgot-password",
  validateBody(ForgotPasswordInput),
  forgotPassword
);

router.use(authMiddleware);
router.post("/logout", logout);

export default router;
