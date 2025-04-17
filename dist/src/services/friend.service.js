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
exports.FriendService = void 0;
const friend_model_1 = __importDefault(require("../models/friend.model"));
const error_response_1 = require("../middlewares/error.response");
const user_repo_1 = require("../models/Repo/user.repo");
class FriendService {
    constructor() {
        this.userRepo = new user_repo_1.UserRepo();
    }
    createFriend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, friendId } = data;
            const user = yield this.userRepo.findById(userId);
            const friendUser = yield this.userRepo.findById(userId);
            // check verify friendUser
            if ((friendUser === null || friendUser === void 0 ? void 0 : friendUser.isVerified) === false) {
                throw new error_response_1.BadRequestError("Friend user is not verified");
            }
            // check if user and friendUser exist
            if (!user || !friendUser) {
                throw new error_response_1.BadRequestError("User or friend not found");
            }
            // check if user and friend are already friends
            if (user._id.equals(friendUser._id)) {
                throw new error_response_1.BadRequestError("You cannot add yourself as a friend");
            }
            const friend = yield friend_model_1.default.findOne({
                userId,
                friendId,
            });
            // publish notication
            // if friend already exists, update the status to pending
            if (friend) {
                // check if friend status unfriended
                if (friend.status === "unfriended" ||
                    friend.status === "cancelled" ||
                    friend.status === "rejected") {
                    friend.status = "pending";
                    yield friend.save();
                    return friend;
                }
                throw new error_response_1.BadRequestError("Friend request already exists");
            }
            // if friend does not exist, create a new friend
            const newFriend = yield friend_model_1.default.create({
                userId,
                friendId,
                status: "pending",
            });
            return newFriend;
        });
    }
    acceptFriend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { friendId, userId } = data;
            const friend = yield friend_model_1.default.findById(friendId);
            // check if friend exists
            if (!friend) {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            // check if friend user is  exist
            const friendUser = yield this.userRepo.findById(friend.userId.toString());
            const user = yield this.userRepo.findById(friend.userId.toString());
            if (!friendUser || !user) {
                throw new error_response_1.BadRequestError("Friend user or user not found");
            }
            // check if friend user is not the same as the user
            if (!friend.friendId.equals(userId)) {
                throw new error_response_1.BadRequestError("You cannot accept this friend request");
            }
            // check if friend status pending
            if (friend.status !== "pending") {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            friend.status = "accepted";
            yield friend.save();
            user.profile.friendsCount++;
            yield user.save();
            friendUser.profile.friendsCount++;
            yield friendUser.save();
            return friend;
        });
    }
    rejectFriend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { friendId, userId } = data;
            const friend = yield friend_model_1.default.findById(friendId);
            // check if friend exists
            if (!friend) {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            if (!friend.friendId.equals(userId)) {
                throw new error_response_1.BadRequestError("You cannot reject this friend request");
            }
            // check if friend status pending
            if (friend.status !== "pending") {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            friend.status = "rejected";
            yield friend.save();
            return friend;
        });
    }
    cancelFriend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { friendId, userId } = data;
            const friend = yield friend_model_1.default.findById(friendId);
            // check if friend exists
            if (!friend) {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            if (!friend.userId.equals(userId)) {
                throw new error_response_1.BadRequestError("You cannot cancel this friend request");
            }
            // check if friend status pending
            if (friend.status !== "pending") {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            friend.status = "cancelled";
            yield friend.save();
            return friend;
        });
    }
    unfriend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { friendId, userId } = data;
            const friend = yield friend_model_1.default.findOne({
                $or: [
                    { userId: userId, friendId: friendId },
                    { userId: friendId, friendId: userId },
                ],
            });
            // check if friend exists
            if (!friend) {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            const friendUser = yield this.userRepo.findById(friend.friendId.toString());
            const user = yield this.userRepo.findById(friend.userId.toString());
            if (!friendUser || !user) {
                throw new error_response_1.BadRequestError("Friend user or user not found");
            }
            // check if friend status accepted
            if (friend.status !== "accepted") {
                throw new error_response_1.BadRequestError("Friend request not found");
            }
            friend.status = "unfriended";
            yield friend.save();
            user.profile.friendsCount--;
            yield user.save();
            friendUser.profile.friendsCount--;
            yield friendUser.save();
            return friend;
        });
    }
    getFriends(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const friends = yield friend_model_1.default.aggregate([
                // get all friends
                {
                    $match: {
                        $or: [
                            { userId: userId, status: "accepted" },
                            { friendId: userId, status: "accepted" },
                        ],
                    },
                },
                // create list userId
                {
                    $project: {
                        frindUser: {
                            $cond: {
                                if: { $eq: ["$userId", userId] },
                                then: "$friendId", // Nếu bạn là người gửi, đối tác là người nhận
                                else: "$userId", // Nếu bạn không phải người gửi (vậy bạn là người nhận), đối tác là người gửi
                            },
                        }
                    }
                },
                // 4. (Tùy chọn) Lookup thêm thông tin của người dùng
                {
                    $lookup: {
                        from: "users", // tên collection chứa thông tin người dùng; đảm bảo tên đúng collection trong MongoDB
                        localField: "_id", // _id ở đây chính là otherUser id
                        foreignField: "_id", // trường _id trong collection users
                        as: "userInfo",
                    },
                },
                // 5. Unwind userInfo nếu bạn muốn lấy object thay vì mảng
                {
                    $unwind: "$userInfo",
                },
                {
                    $skip: skip,
                    $limit: limit
                },
                // 6. Dự án chỉ những field bạn cần (vd: id và thông tin user)
                {
                    $project: {
                        _id: 1,
                        userInfo: 1,
                    },
                },
            ]);
            return friends;
        });
    }
    getFriendRequests(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const friendRequests = yield friend_model_1.default
                .find({
                $or: [
                    { userId, status: "pending" },
                    { friendId: userId, status: "pending" },
                ],
            })
                .skip(skip)
                .limit(limit)
                .lean();
            return friendRequests;
        });
    }
    findByNameFriend(userId, search, name, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const friends = yield friend_model_1.default
                .find({
                $or: [
                    { userId, status: "accepted" },
                    { friendId: userId, status: "accepted" },
                ],
                $text: { $search: search },
            })
                .populate({
                path: "friendId",
                match: { $text: { $search: name } },
            })
                .skip(skip)
                .limit(limit)
                .lean();
            // Lọc ra những bạn bè phù hợp (vì nếu không khớp text thì friendId sẽ là null)
            const matched = friends.filter((f) => f.friendId !== null);
            return matched;
        });
    }
}
exports.FriendService = FriendService;
exports.default = new FriendService();
