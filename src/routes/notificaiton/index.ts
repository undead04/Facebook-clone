import * as express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  getNotifications,
  readNotification,
  deleteNotification,
} from "../../controllers/notification.controller";
const router = express.Router();

router.use(authMiddleware);
router.get("/", getNotifications);
router.patch("/:notificationId", readNotification);
router.delete("/:notificationId", deleteNotification);

export default router;
