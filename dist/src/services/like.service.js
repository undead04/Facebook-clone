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
exports.LikeService = void 0;
const error_response_1 = require("../middlewares/error.response");
const post_model_1 = __importDefault(require("../models/post.model"));
const like_model_1 = __importDefault(require("../models/like.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const init_redis_1 = __importDefault(require("../databases/init.redis"));
const friend_model_1 = __importDefault(require("../models/friend.model"));
const index_1 = require("../utils/index");
class LikeService {
    createLike(activeUserId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                // 1. Tìm bài viết (KHÔNG dùng lean để còn .save())
                const post = yield post_model_1.default.findById(postId).session(session);
                if (!post) {
                    throw new error_response_1.NotFoundError("Post not found");
                }
                // 2. Kiểm tra quan hệ bạn bè
                let friend;
                if (post.userId.toString() !== activeUserId.toString()) {
                    friend = yield friend_model_1.default
                        .findOne({
                        $or: [
                            { userId: activeUserId, friendId: post.userId },
                            { userId: post.userId, friendId: activeUserId },
                        ],
                    })
                        .session(session)
                        .lean();
                }
                // 3. Kiểm tra đã like chưa (bằng Redis bitmap)
                const bitIndex = (0, index_1.stringToBitIndex)(activeUserId.toString());
                const isLiked = yield this.handleLikeExitRedis(postId, bitIndex);
                if (isLiked) {
                    throw new error_response_1.BadRequestError("You already liked this post");
                }
                // 4. Ghi like vào DB
                yield like_model_1.default.create([
                    {
                        postId,
                        userId: activeUserId,
                    },
                ], { session });
                // 5. Ghi like vào Redis bitmap
                yield this.handleLikeRedis(postId, bitIndex);
                // 6. Tăng đếm like trong Redis
                yield init_redis_1.default.incr(`post:${postId}:like:count`);
                // 7. Cập nhật countLike trong DB
                post.countLike += 1;
                yield post.save({ session });
                // 6. Commit DB transaction
                yield session.commitTransaction();
                session.endSession();
                // 8. Gửi thông báo nếu là bạn bè
                if (friend) {
                }
                return "Liked Successfully";
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    unlike(activeUserId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                // check post
                const post = yield post_model_1.default.findById(postId).session(session);
                if (!post) {
                    throw new error_response_1.NotFoundError("Post not found");
                }
                const bitIndex = (0, index_1.stringToBitIndex)(activeUserId.toString());
                const isLiked = yield this.handleLikeExitRedis(postId, bitIndex);
                if (!isLiked) {
                    throw new error_response_1.BadRequestError("You have not liked this post");
                }
                yield like_model_1.default.deleteOne({
                    userId: activeUserId,
                    postId,
                }, { session });
                post.countLike -= 1;
                yield post.save({ session });
                yield session.commitTransaction();
                session.endSession();
                yield this.handleUnlikeRedis(postId, bitIndex);
                // Redis: giảm đếm like
                yield init_redis_1.default.decr(`post:${postId}:like:count`);
                return "Unliked Successfully";
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    // === ĐỒNG BỘ LẠI REDIS từ MongoDB nếu Redis bị mất ===
    syncLikesFromDBToRedis(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield like_model_1.default.find({ postId }).lean();
            const key = `post:${postId}:like`;
            for (const like of likes) {
                const bitIndex = (0, index_1.stringToBitIndex)(like.userId.toString());
                yield init_redis_1.default.setbit(key, bitIndex, 1);
            }
            // cập nhật lại count
            yield init_redis_1.default.set(`${key}:count`, likes.length.toString());
            return "Sync completed";
        });
    }
    // === Đếm like (ưu tiên Redis) ===
    getLikeCount(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield init_redis_1.default.get(`post:${postId}:like:count`);
            if (count !== null)
                return parseInt(count);
            // Nếu Redis chưa có → đồng bộ lại
            yield this.syncLikesFromDBToRedis(postId);
            return parseInt((yield init_redis_1.default.get(`post:${postId}:like:count`)) || "0");
        });
    }
    getListLike(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield like_model_1.default
                .find({ postId })
                .populate({
                path: "userId",
                select: "profile.firstName profile.lastName profile.avatarUrl _id",
            })
                .lean();
            return likes;
        });
    }
    handleLikeRedis(postId, bitIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            yield init_redis_1.default.setbit(`post:${postId}:like`, bitIndex, 1);
        });
    }
    handleUnlikeRedis(postId, bitIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            yield init_redis_1.default.setbit(`post:${postId}:like`, bitIndex, 0);
        });
    }
    handleLikeCountRedis(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield like_model_1.default.countDocuments({ postId });
            yield init_redis_1.default.set(`post:${postId}:like:count`, count.toString());
        });
    }
    handleLikeExitRedis(postId, bitIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLiked = yield init_redis_1.default.getbit(`post:${postId}:like`, bitIndex);
            return isLiked === 1;
        });
    }
}
exports.LikeService = LikeService;
