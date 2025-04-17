'use strict';
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
exports.UserService = void 0;
const error_response_1 = require("../middlewares/error.response");
const user_model_1 = __importDefault(require("../models/user.model"));
const utils_1 = require("../utils");
const cache_repo_1 = require("../models/Repo/cache.repo");
const cacheContant_1 = require("../models/cacheContant");
const AWSBucket_service_1 = require("./AWSBucket.service");
const postPublish_1 = require("../messaging/postPublish");
const user_repo_1 = require("../models/Repo/user.repo");
class UserService {
    constructor() {
        this.getMe = (userId) => __awaiter(this, void 0, void 0, function* () {
            // Get User CaChe
            const cacheUser = yield this.getCacheUser(userId);
            if (cacheUser) {
                return cacheUser;
            }
            // find user DB
            const user = yield user_model_1.default.findById(userId).where({ isDelete: false }).select(["-password", "-__v"]);
            // set Cache
            yield this.setCacheUser(userId, user);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            return user;
        });
        this.updateMe = (userId, data) => __awaiter(this, void 0, void 0, function* () {
            // check user exists
            const user = yield this.repo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            // assign data to user
            Object.assign(user.profile, data);
            yield user.save();
            // delete cache
            yield this.deleteCacheUser(userId);
            return (0, utils_1.getInfoData)(["profile"], user);
        });
        this.updateAvatar = (userId, avatar) => __awaiter(this, void 0, void 0, function* () {
            // check Exit
            const user = yield this.repo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            // update Avatar
            if (avatar) {
                const result = yield this.awsBuckset.uploadImageFromLocal(avatar, "avatar");
                user.profile.avatarName = result.key;
                user.save();
                // publish post
                yield (0, postPublish_1.postPublish)({
                    userId: userId,
                    content: `Update Avatar`,
                    imagesName: result.key,
                    typePost: "profile",
                });
                // publish notifi
            }
            // delete Cache
            yield this.deleteCacheUser;
            return user;
        });
        this.updateCoverPhoto = (userId, coverPhoto) => __awaiter(this, void 0, void 0, function* () {
            // check Exit
            const user = yield this.repo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            // update CoverPhoto
            if (coverPhoto) {
                const result = yield this.awsBuckset.uploadImageFromLocal(coverPhoto, "coverPhoto");
                user.profile.coverPhotoName = result.key;
                user.save();
                // publish post
                yield (0, postPublish_1.postPublish)({
                    userId: userId,
                    content: `Update CoverPhoto`,
                    imagesName: result.key,
                    typePost: "profile",
                });
                // publish notifi      
            }
            // delete Cache
            yield this.deleteCacheUser(userId);
            return user;
        });
        this.deleteAvatar = (userId) => __awaiter(this, void 0, void 0, function* () {
            // check Exit
            const user = yield this.repo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            user.profile.avatarName = "";
            yield user.save();
            // delete Cache
            yield this.deleteCacheUser(userId);
            return user;
        });
        this.deleteCoverPhoto = (userId) => __awaiter(this, void 0, void 0, function* () {
            // Check exit
            const user = yield this.repo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            user.profile.coverPhotoName = "";
            yield user.save();
            // delete Cache
            yield this.deleteCacheUser(userId);
            return user;
        });
        this.changePassword = (userId, data) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            const isMatch = yield (0, utils_1.comparePassword)(data.password, user.password);
            if (!isMatch) {
                throw new error_response_1.BadRequestError("Password is incorrect");
            }
            // check new password and confirm password
            if (data.newPassword !== data.confirmPassword) {
                throw new error_response_1.BadRequestError("New password and confirm password do not match");
            }
            // check new password is not the same as old password
            if (data.newPassword === data.password) {
                throw new error_response_1.BadRequestError("New password cannot be the same as old password");
            }
            user.password = (0, utils_1.hashPassword)(data.newPassword);
            yield user.save();
        });
        this.findUserByName = (keyword_1, ...args_1) => __awaiter(this, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const users = yield user_model_1.default
                .find({ $text: { $search: keyword } }, { score: { $meta: "textScore" } } // Lấy điểm relevance
            )
                .sort({ score: { $meta: "textScore" } }) // Ưu tiên kết quả phù hợp
                .skip(skip)
                .limit(limit);
            if (!users.length) {
                throw new error_response_1.BadRequestError("No matching users found");
            }
            return users;
        });
        this.deleteCacheUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            const key = `${cacheContant_1.USER}:${userId}`;
            yield (0, cache_repo_1.deleteCacheID)({ key });
        });
        this.setCacheUser = (userId, user) => __awaiter(this, void 0, void 0, function* () {
            const key = `${cacheContant_1.USER}:${userId}`;
            const value = JSON.stringify(user);
            const exp = 30 + (0, utils_1.randomNumber)(10, 30);
            yield (0, cache_repo_1.setCacheIDExprication)({ key, value, exp });
        });
        this.getCacheUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            const key = `${cacheContant_1.USER}:${userId}`;
            return yield (0, cache_repo_1.getCacheID)({ key });
        });
        this.awsBuckset = new AWSBucket_service_1.AWSBucketService();
        this.repo = new user_repo_1.UserRepo();
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.findByIdAndUpdate(userId, { $set: { isDeleted: true }, new: true });
            yield this.deleteCacheUser(userId);
        });
    }
}
exports.UserService = UserService;
