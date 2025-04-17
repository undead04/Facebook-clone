"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getCommentsByParentId = exports.createComment = void 0;
const success_response_1 = require("../middlewares/success.response");
const comment_service_1 = require("../services/comment.service");
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const service = new comment_service_1.CommentService();
exports.createComment = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content, parentCommentId } = req.body;
    const userId = req.user._id;
    new success_response_1.CREATED({
        message: "Comment created successfully",
        metaData: yield service.createComment(postId, userId, content, parentCommentId),
    }).send(res);
}));
exports.getCommentsByParentId = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const parentCommentId = req.query.parentCommentId
        ? req.query.parentCommentId
        : null;
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Comments fetched successfully",
        metaData: yield service.getCommentsByParentId(postId, parentCommentId, userId),
    }).send(res);
}));
exports.deleteComment = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId, postId } = req.body;
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Comment deleted successfully",
        metaData: yield service.deleteComments(commentId, postId),
    }).send(res);
}));
