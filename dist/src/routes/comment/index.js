"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../../controllers/comment.controller");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.default);
router.post("/create-comment", comment_controller_1.createComment);
router.get("/:postId/list-comment", comment_controller_1.getCommentsByParentId);
router.delete("/delete-comment", comment_controller_1.deleteComment);
exports.default = router;
