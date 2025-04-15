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

router.use(authMiddleware);

router.post("/create", createFriend);
router.patch("/accept", acceptFriend);
router.patch("/reject", rejectFriend);
router.patch("/cancel", cancelFriend);
router.patch("/unfriend", unfriend);

router.get("/friends", getFriends);
router.get("/friend-requests", getFriendRequests);

export default router;
