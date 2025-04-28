import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  cancelFriend,
  createFriend,
  unfriend,
  acceptFriend,
  getFriendRequests,
  getFriends,
  rejectFriend,
} from "../../controllers/friend.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend management and relationships
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FriendRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Friend request ID
 *         userId:
 *           type: string
 *           description: ID of the user who sent the request
 *         friendId:
 *           type: string
 *           description: ID of the requested friend
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, cancelled]
 *           description: Status of the friend request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the request was last updated
 *     FriendRequestInput:
 *       type: object
 *       required:
 *         - friendId
 *       properties:
 *         friendId:
 *           type: string
 *           description: ID of the user to send/accept/reject friend request
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/friends/create:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestInput'
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Create friend successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/FriendRequest'
 */
router.post("/create", createFriend);

/**
 * @swagger
 * /api/v1/friends/accept:
 *   patch:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestInput'
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Accept friend successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/FriendRequest'
 */
router.patch("/accept", acceptFriend);

/**
 * @swagger
 * /api/v1/friends/reject:
 *   patch:
 *     summary: Reject a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestInput'
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reject friend successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/FriendRequest'
 */
router.patch("/reject", rejectFriend);

/**
 * @swagger
 * /api/v1/friends/cancel:
 *   patch:
 *     summary: Cancel a sent friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestInput'
 *     responses:
 *       200:
 *         description: Friend request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cancel friend successfully
 *                 metaData:
 *                   $ref: '#/components/schemas/FriendRequest'
 */
router.patch("/cancel", cancelFriend);

/**
 * @swagger
 * /api/v1/friends/unfriend:
 *   patch:
 *     summary: Remove a user from friends list
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendRequestInput'
 *     responses:
 *       200:
 *         description: Friend removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unfriend successfully
 *                 metaData:
 *                   type: object
 */
router.patch("/unfriend", unfriend);

/**
 * @swagger
 * /api/v1/friends/friends:
 *   get:
 *     summary: Get list of current user's friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of friends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get friends successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     friends:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 */
router.get("/friends", getFriends);

/**
 * @swagger
 * /api/v1/friends/friend-requests:
 *   get:
 *     summary: Get list of pending friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of friend requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get friend requests successfully
 *                 metaData:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           user:
 *                             $ref: '#/components/schemas/User'
 *                           status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 */
router.get("/friend-requests", getFriendRequests);

export default router;
