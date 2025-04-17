"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const friend_controller_1 = require("../../controllers/friend.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/create", friend_controller_1.createFriend);
router.patch("/accept", friend_controller_1.acceptFriend);
router.patch("/reject", friend_controller_1.rejectFriend);
router.patch("/cancel", friend_controller_1.cancelFriend);
router.patch("/unfriend", friend_controller_1.unfriend);
router.get("/friends", friend_controller_1.getFriends);
router.get("/friend-requests", friend_controller_1.getFriendRequests);
exports.default = router;
