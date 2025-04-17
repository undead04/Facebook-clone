"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const like_controller_1 = require("../../controllers/like.controller");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/create-like", like_controller_1.createLike);
router.delete("/unlike", like_controller_1.unlike);
router.get("/:postId/list-like", like_controller_1.getListLike);
router.get("/:postId/like-count", like_controller_1.getLikeCount);
exports.default = router;
