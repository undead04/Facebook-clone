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
  deleteUser,
} from "../../controllers/user.controller";
import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import { uploadMemory } from "../../middlewares/multer.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  updateUserInput,
  changePasswordInput,
} from "../../validations/user/index";
import validateParamId from "../../middlewares/validateParam";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         dob:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: User's gender
 *         bio:
 *           type: string
 *           description: User's biography
 *         phone:
 *           type: string
 *           description: User's phone number
 *         avatarName:
 *           type: string
 *           description: User's avatar image name
 *         coverPhotoName:
 *           type: string
 *           description: User's cover photo name
 *         urlImageAvatar:
 *           type: string
 *           description: URL to user's avatar image
 *         urlImageCoverPhoto:
 *           type: string
 *           description: URL to user's cover photo
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         profile:
 *           $ref: '#/components/schemas/UserProfile'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation date
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - password
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         password:
 *           type: string
 *           description: Current password
 *         newPassword:
 *           type: string
 *           description: New password
 *         confirmPassword:
 *           type: string
 *           description: Confirm new password
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         bio:
 *           type: string
 *         phone:
 *           type: string
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get me successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/User'
 */
router.get("/me", getMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update me successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/User'
 */
router.patch("/me", validateBody(updateUserInput), updateMe);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update avatar successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     urlImageAvatar:
 *                       type: string
 *                       example: https://example.com/images/avatar.jpg
 */
router.patch("/me/avatar", uploadMemory.single("avatar"), updateAvatar);

/**
 * @swagger
 * /api/v1/users/me/cover-photo:
 *   patch:
 *     summary: Update user cover photo
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Cover photo image file
 *     responses:
 *       200:
 *         description: Cover photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update cover photo successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     urlImageCoverPhoto:
 *                       type: string
 *                       example: https://example.com/images/cover.jpg
 */
router.patch(
  "/me/cover-photo",
  uploadMemory.single("coverPhoto"),
  updateCoverPhoto
);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete avatar successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     urlImageAvatar:
 *                       type: string
 *                       example: ""
 */
router.delete("/me/avatar", deleteAvatar);

/**
 * @swagger
 * /api/v1/users/me/cover-photo:
 *   delete:
 *     summary: Delete user cover photo
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cover photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete cover photo successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     urlImageCoverPhoto:
 *                       type: string
 *                       example: ""
 */
router.delete("/me/cover-photo", deleteCoverPhoto);

/**
 * @swagger
 * /api/v1/users/me/password:
 *   patch:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Change password successfully
 *                 metaData:
 *                   type: object
 */
router.patch("/me/password", validateBody(changePasswordInput), changePassword);

/**
 * @swagger
 * /api/v1/users/search:
 *   get:
 *     summary: Search users by name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get user by name successfully
 *                 metaData:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get("/search", getUserByName);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get user by id successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/User'
 */
router.get("/:userId", getUserById);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete user successfully
 *                 metaData:
 *                   type: object
 */
router.delete("/:userId", deleteUser);
export default router;
