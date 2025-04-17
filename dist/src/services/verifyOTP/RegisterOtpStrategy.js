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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterOtpStrategy = void 0;
const user_repo_1 = require("../../models/Repo/user.repo");
const utils_1 = require("../../utils");
const cache_repo_1 = require("../../models/Repo/cache.repo");
const emailPublish_1 = require("../../messaging/emailPublish");
const error_response_1 = require("../../middlewares/error.response");
const verifyEmailTemplate_1 = require("../../utils/templates/verifyEmailTemplate");
class RegisterOtpStrategy {
    constructor() {
        this.userRepo = new user_repo_1.UserRepo();
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `verify:${email}`;
            const otpCache = yield (0, cache_repo_1.getCacheID)({ key });
            if (otpCache !== otp)
                return false;
            yield (0, cache_repo_1.deleteCacheID)({ key });
            return true;
        });
    }
    sendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findbyEmail(email);
            if (!user) {
                throw new error_response_1.NotFoundError("User NotFound");
            }
            if (user.isVerified) {
                throw new error_response_1.BadRequestError("User already verify");
            }
            const otp = (0, utils_1.generateOTP)();
            const key = `verify:${email}`;
            yield (0, cache_repo_1.setCacheIDExprication)({ key, value: otp, exp: 60 * 15 });
            yield (0, emailPublish_1.emailPublish)({
                to: email,
                subject: "OTP for verify email",
                html: (0, verifyEmailTemplate_1.generateVerifyEmailTemplate)(otp, `${user.profile.firstName} ${user.profile.lastName}`),
            });
        });
    }
}
exports.RegisterOtpStrategy = RegisterOtpStrategy;
