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
exports.CommentService = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const error_response_1 = require("../middlewares/error.response");
const friend_model_1 = __importDefault(require("../models/friend.model"));
class CommentService {
    createComment(postId_1, userId_1, content_1) {
        return __awaiter(this, arguments, void 0, function* (postId, userId, content, parentCommentId = null) {
            // check post
            const post = yield post_model_1.default.findById(postId);
            if (!post)
                throw new error_response_1.NotFoundError("post not found");
            // create comment
            const comment = new comment_model_1.default({
                comment_postId: postId,
                comment_userId: userId,
                comment_content: content,
                comment_parent: parentCommentId,
            });
            // update comment_left and comment_right
            let rightValue = 0;
            if (parentCommentId) {
                const parentComment = yield comment_model_1.default.findById(parentCommentId);
                if (!parentComment)
                    throw new error_response_1.NotFoundError("parent comment not found");
                rightValue = parentComment.comment_right;
                // updateMany comments
                yield comment_model_1.default.updateMany({
                    comment_postId: postId,
                    comment_right: { $gte: rightValue },
                }, {
                    $inc: { comment_right: 2 },
                });
                yield comment_model_1.default.updateMany({
                    comment_postId: postId,
                    comment_left: { $gt: rightValue },
                }, {
                    $inc: { comment_left: 2 },
                });
            }
            else {
                const maxRightValue = yield comment_model_1.default.findOne({
                    comment_postId: postId,
                });
                if (maxRightValue) {
                    rightValue = maxRightValue.comment_right + 1;
                }
                else {
                    rightValue = 1;
                }
            }
            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;
            post.countComment += 1;
            yield post.save();
            yield comment.save();
            // 2. Kiểm tra quan hệ bạn bè
            let friend;
            if (post.userId.toString() !== userId.toString()) {
                friend = yield friend_model_1.default
                    .findOne({
                    $or: [
                        { userId: userId, friendId: post.userId },
                        { userId: post.userId, friendId: userId },
                    ],
                })
                    .lean();
            }
            // publish notification
            if (friend) {
            }
            return comment;
        });
    }
    getCommentsByParentId(postId_1, parentCommentId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, parentCommentId, limit = 10, skip = 0) {
            // check post
            const post = yield post_model_1.default.findById(postId);
            if (!post)
                throw new error_response_1.NotFoundError("post not found");
            // get comments
            if (parentCommentId) {
                const parent = yield comment_model_1.default.findById(parentCommentId);
                if (!parent)
                    throw new error_response_1.NotFoundError("parent comment not found");
                const comments = yield comment_model_1.default
                    .find({
                    comment_postId: postId,
                    comment_left: { $gt: parent.comment_left },
                    comment_right: { $lte: parent.comment_right },
                })
                    .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_parent: 1,
                })
                    .sort({
                    comment_left: 1,
                });
                return comments;
            }
            const comments = yield comment_model_1.default
                .find({
                comment_postId: postId,
                comment_parent: parentCommentId,
            })
                .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parent: 1,
            })
                .sort({
                comment_left: 1,
            });
            return comments;
        });
    }
    deleteComments(commentId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            // check post
            const post = yield post_model_1.default.findById(postId);
            if (!post)
                throw new error_response_1.NotFoundError("post not found");
            // check comment
            const comment = yield comment_model_1.default.findById(commentId);
            if (!comment)
                throw new error_response_1.NotFoundError("comment not found");
            // tinh width
            const width = comment.comment_right - comment.comment_left + 1;
            yield comment_model_1.default.deleteMany({
                comment_postId: postId,
                comment_left: { $gte: comment.comment_left, $lt: comment.comment_right },
            });
            yield comment_model_1.default.updateMany({
                comment_postId: postId,
                comment_right: { $gt: comment.comment_right },
            }, {
                $inc: { comment_right: -width },
            });
            yield comment_model_1.default.updateMany({
                comment_postId: postId,
                comment_left: { $gt: comment.comment_right },
            }, {
                $inc: { comment_left: -width },
            });
            return true;
        });
    }
}
exports.CommentService = CommentService;
