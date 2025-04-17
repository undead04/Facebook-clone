"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_1 = require("../../validations/auth");
const router = (0, express_1.Router)();
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
router.post("/register", (0, validate_middleware_1.validateBody)(auth_1.RegisterInput), auth_controller_1.register);
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
router.post("/login", (0, validate_middleware_1.validateBody)(auth_1.LoginInput), auth_controller_1.login);
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
router.post("/logout", auth_controller_1.logout);
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
router.post("/refresh-token", (0, validate_middleware_1.validateBody)(auth_1.RefreshTokenInput), auth_controller_1.refreshToken);
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
router.post("/send-otp", auth_controller_1.sendOTP);
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
router.post("/verify-email", (0, validate_middleware_1.validateBody)(auth_1.VerifyOTPInput), auth_controller_1.verifyEmail);
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
router.post("/verify-password", (0, validate_middleware_1.validateBody)(auth_1.VerifyOTPInput), auth_controller_1.verifyPassword);
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
router.post("/forgot-password", (0, validate_middleware_1.validateBody)(auth_1.ForgotPasswordInput), auth_controller_1.forgotPassword);
router.use(auth_middleware_1.default);
router.post("/logout", auth_controller_1.logout);
exports.default = router;
