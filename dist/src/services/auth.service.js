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
exports.AuthService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const error_response_1 = require("../middlewares/error.response");
const utils_1 = require("../utils");
const cache_repo_1 = require("../models/Repo/cache.repo");
const OtpStrategyFactory_1 = require("./verifyOTP/OtpStrategyFactory");
const user_repo_1 = require("../models/Repo/user.repo");
class AuthService {
    constructor() {
        this.userRepo = new user_repo_1.UserRepo();
        // register
        this.register = (data) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, lastName, birthday, gender } = data;
            // check if user already exists
            const user = yield this.userRepo.findbyEmail(email);
            if (user) {
                throw new error_response_1.BadRequestError("User already exists");
            }
            // hash password
            const hashedPassword = yield (0, utils_1.hashPassword)(password);
            // create user
            yield user_model_1.default.create({
                email,
                password: hashedPassword,
                profile: {
                    firstName,
                    lastName,
                    birthday,
                    gender,
                },
            });
            yield this.sendOTP(email, OtpStrategyFactory_1.typeOTP.register);
            return "Register successfully";
        });
        this.login = (_a) => __awaiter(this, [_a], void 0, function* ({ email, password }) {
            const user = yield this.userRepo.findbyEmail(email);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            // check if password is correct
            const isPasswordCorrect = yield (0, utils_1.comparePassword)(password, user.password);
            if (!isPasswordCorrect) {
                throw new error_response_1.BadRequestError("Password is incorrect");
            }
            if (user.isVerified === false) {
                throw new error_response_1.BadRequestError("User not verified");
            }
            // generate token
            const refreshToken = (0, utils_1.createRefreshToken)(user._id.toString());
            const accessToken = (0, utils_1.createAccessToken)(user._id.toString());
            // save refresh token to database
            yield user_model_1.default.findByIdAndUpdate(user._id, {
                $set: {
                    refreshToken,
                },
                new: true,
            });
            return {
                user: (0, utils_1.getInfoData)([
                    "_id",
                    "email",
                    "profile.firstName",
                    "profile.lastName",
                    "profile.avatar",
                ], user),
                refreshToken,
                accessToken,
            };
        });
        this.logout = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findById(userId);
            if (!user) {
                throw new error_response_1.BadRequestError("User not found");
            }
            user.refreshToken = "";
            yield user.save();
            return user;
        });
        this.refreshToken = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ refreshToken });
            if (!user) {
                throw new error_response_1.BadRequestError("Refresh token is invalid");
            }
            const decoded = yield (0, utils_1.verifyToken)(refreshToken);
            if (user._id.toString() !== decoded._id) {
                throw new error_response_1.BadRequestError("User not found");
            }
            if (user.isVerified === false) {
                throw new error_response_1.BadRequestError("User not verified");
            }
            const accessToken = (0, utils_1.createAccessToken)(user._id.toString());
            return accessToken;
        });
    }
    sendOTP(email, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = OtpStrategyFactory_1.OtpStrategyFactory.getStrategy(type);
            yield factory.sendOTP(email);
        });
    }
    verifyUser(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findbyEmail(email);
            if (user && user.isVerified) {
                throw new error_response_1.BadRequestError("User already verified");
            }
            const factory = OtpStrategyFactory_1.OtpStrategyFactory.getStrategy(OtpStrategyFactory_1.typeOTP.register);
            const isOTP = yield factory.verifyOTP(email, otp);
            if (!isOTP) {
                throw new error_response_1.BadRequestError("OTP is invalid");
            }
            yield this.userRepo.findByUpdateVerify(email);
        });
    }
    verifyPassword(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = OtpStrategyFactory_1.OtpStrategyFactory.getStrategy(OtpStrategyFactory_1.typeOTP.forgot);
            const isOTP = yield factory.verifyOTP(email, otp);
            if (!isOTP) {
                throw new error_response_1.BadRequestError("OTP is invalid");
            }
            const newOTP = (0, utils_1.generateOTP)();
            const key = `password:${email}`;
            yield (0, cache_repo_1.setCacheIDExprication)({ key, value: newOTP, exp: 60 * 15 });
            return {
                newOTP
            };
        });
    }
    forgotPassword(otp, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `password:${email}`;
            const cacheOTP = yield (0, cache_repo_1.getCacheID)({ key });
            console.log(cacheOTP);
            if (otp !== cacheOTP) {
                throw new error_response_1.BadRequestError("OTP is invalid");
            }
            const passwordHash = yield (0, utils_1.hashPassword)(password);
            yield this.userRepo.findByUpdatePassword(email, passwordHash);
            yield (0, cache_repo_1.deleteCacheID)({ key });
        });
    }
}
exports.AuthService = AuthService;
