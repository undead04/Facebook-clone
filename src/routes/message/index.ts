"use strict";
import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getListChat,
  getListMessage,
} from "../../controllers/message.controller";
import authMiddleware from "../../middlewares/auth.middleware";
const router = Router();
router.use(authMiddleware);
router.post("/create-message", createMessage);
router.post("/get-list-message", getListMessage);
router.post("/delete-message", deleteMessage);
router.post("/get-list-chat", getListChat);

export default router;
