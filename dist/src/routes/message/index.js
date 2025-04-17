"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../../controllers/message.controller");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/create-message", message_controller_1.createMessage);
router.post("/get-list-message", message_controller_1.getListMessage);
router.post("/delete-message", message_controller_1.deleteMessage);
router.post("/get-list-chat", message_controller_1.getListChat);
exports.default = router;
