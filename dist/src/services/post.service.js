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
exports.PostService = void 0;
const post_model_1 = __importDefault(require("../models/post.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const friend_model_1 = __importDefault(require("../models/friend.model"));
const error_response_1 = require("../middlewares/error.response");
const user_repo_1 = require("../models/Repo/user.repo");
class PostService {
    constructor() {
        this.userRepo = new user_repo_1.UserRepo();
    }
    createPost(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, content, images, statusPost }) {
            // check user
            const user = yield this.userRepo.findById(userId);
            if (!user) {
                throw new error_response_1.NotFoundError("User not found");
            }
            const newPost = yield post_model_1.default.create({
                userId,
                content,
                statusPost,
            });
            // upload images rabbitmq
            if (images) {
                if (images.length > 0) {
                }
            }
            return "Create post successfully";
        });
    }
    getPosts(activeUserId, page, limit, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            // 1. Lấy thông tin người đăng bài và người đang xem
            const [user, activeUser, userFriend] = yield Promise.all([
                user_model_1.default.findById(userId),
                user_model_1.default.findById(activeUserId),
                friend_model_1.default.findOne({
                    $or: [
                        { userId: activeUserId, friendId: userId },
                        { userId, friendId: activeUserId },
                    ],
                }),
            ]);
            if (!user)
                throw new error_response_1.NotFoundError("User not found");
            if (!activeUser)
                throw new error_response_1.NotFoundError("Active user not found");
            // 2. Tính quyền xem bài viết
            let visibilityFilter = {};
            if (activeUserId.toString() === userId.toString()) {
                // Là chính mình => xem tất cả
                visibilityFilter = {};
            }
            else if (userFriend && userFriend.status === "accepted") {
                // Là bạn bè => xem bài public và friends
                visibilityFilter = { statusPost: { $in: ["public", "friends"] } };
            }
            else {
                // Người lạ => chỉ xem bài public
                visibilityFilter = { statusPost: "public" };
            }
            // 3. Tìm bài viết
            const posts = yield post_model_1.default
                .find(Object.assign({ userId }, visibilityFilter))
                .populate({
                path: "userId",
                select: "profile.avatarUrl profile.firstName profile.lastName _id",
            })
                .select([
                "_id",
                "userId",
                "imagesUrl",
                "imagesName",
                "content",
                "countLike",
                "countComment",
                "statusPost",
                "createdAt",
                "updatedAt",
            ])
                .sort({ createdAt: -1 }) // gợi ý: sắp xếp mới nhất trước
                .skip(skip)
                .limit(limit)
                .lean();
            return posts;
        });
    }
    getPostById(activeUserId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Lấy thông tin người đăng bài và người đang xem
            const post = yield post_model_1.default.findById(postId);
            if (!post)
                throw new error_response_1.NotFoundError("Post not found");
            const userId = post.userId;
            const userFriend = yield friend_model_1.default.findOne({
                $or: [
                    { userId: activeUserId, friendId: userId },
                    { userId, friendId: activeUserId },
                ],
            });
            // 2. Tính quyền xem bài viết
            let statusPost = [];
            if (activeUserId.toString() === userId.toString()) {
                // Là chính mình => xem tất cả
                statusPost = ["public", "friends", "private"];
            }
            else if (userFriend && userFriend.status === "accepted") {
                // Là bạn bè => xem bài public và friends
                statusPost = ["public", "friends"];
            }
            else {
                // Người lạ => chỉ xem bài public
                statusPost = ["public"];
            }
            if (!statusPost.includes(post.statusPost)) {
                throw new error_response_1.ForbiddenError("You are not allowed to see this post");
            }
            return post;
        });
    }
    updateStatusPost(activeUserId_1, postId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (activeUserId, postId, { statusPost }) {
            // check post
            const post = yield post_model_1.default.findById(postId);
            if (!post) {
                throw new error_response_1.NotFoundError("Post not found");
            }
            // check user
            const user = yield user_model_1.default.findById(activeUserId);
            if (!user) {
                throw new error_response_1.NotFoundError("User not found");
            }
            // check user is owner post
            if (post.userId.toString() !== user._id.toString()) {
                throw new error_response_1.ForbiddenError("You are not allowed to update this post");
            }
            // update status post
            post.statusPost = statusPost;
            yield post.save();
            return post;
        });
    }
    updatePost(activeUser_1, postId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (activeUser, postId, { content, images }) {
            // check post
            const post = yield post_model_1.default.findById(postId);
            if (!post) {
                throw new error_response_1.NotFoundError("Post not found");
            }
            // check user
            const user = yield user_model_1.default.findById(activeUser);
            if (!user) {
                throw new error_response_1.NotFoundError("User not found");
            }
            // check user is owner post
            if (post.userId.toString() !== user._id.toString()) {
                throw new error_response_1.ForbiddenError("You are not allowed to update this post");
            }
            // update post
            post.content = content;
            // upload images rabbitmq
            if (images) {
                if (images.length > 0) {
                }
            }
            yield post.save();
            return "Update post successfully";
        });
    }
    getPostsByCursor(activeUserId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const activeUser = yield user_model_1.default.findById(activeUserId);
            if (!activeUser)
                throw new error_response_1.NotFoundError("Active user not found");
            const friends = yield friend_model_1.default.find({
                $or: [
                    { userId: activeUserId, status: "accepted" },
                    { friendId: activeUserId, status: "accepted" },
                ],
            });
            const posts = yield post_model_1.default.aggregate([
                {
                    $addFields: {
                        priority: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$userId", activeUser._id] }, then: 3 },
                                    { case: { $in: ["$userId", friends] }, then: 2 },
                                    { case: { $eq: ["$statusPost", "public"] }, then: 1 },
                                ],
                                default: 0,
                            },
                        },
                    },
                },
                {
                    $match: {
                        $or: [
                            { userId: activeUser._id },
                            { userId: { $in: friends } },
                            { visibility: "public" },
                        ],
                    },
                },
                {
                    $sort: { priority: -1, likes: -1, createdAt: -1 },
                    // Ưu tiên bài của mình > bạn bè > public
                    // Trong cùng nhóm thì bài nào nhiều like hơn lên trước
                    // Có thể thêm sort theo createdAt nếu cần
                },
                { $skip: skip },
                { $limit: limit },
            ]);
            return posts;
        });
    }
    setCachePost(postId, value) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getCachePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    deleteCacheDelete(postId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.PostService = PostService;
