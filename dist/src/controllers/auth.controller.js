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
exports.forgotPassword = exports.verifyPassword = exports.verifyEmail = exports.sendOTP = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const auth_service_1 = require("../services/auth.service");
const success_response_1 = require("../middlewares/success.response");
const service = new auth_service_1.AuthService();
exports.register = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    new success_response_1.CREATED({
        message: "Register successfully",
        metaData: yield service.register(data),
    }).send(res);
}));
exports.login = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    new success_response_1.OK({
        message: "Login successfully",
        metaData: yield service.login(data),
    }).send(res);
}));
exports.logout = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Logout successfully",
        metaData: yield service.logout(userId),
    }).send(res);
}));
exports.refreshToken = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    new success_response_1.OK({
        message: "Refresh token successfully",
        metaData: yield service.refreshToken(refreshToken),
    }).send(res);
}));
exports.sendOTP = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, typeOTP } = req.body;
    new success_response_1.OK({
        message: "Send OTP email successfully",
        metaData: yield service.sendOTP(email, typeOTP),
    }).send(res);
}));
exports.verifyEmail = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    new success_response_1.OK({
        message: "Verify email successfully",
        metaData: yield service.verifyUser(email, otp),
    }).send(res);
}));
exports.verifyPassword = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    new success_response_1.OK({
        message: "Verify password successfully",
        metaData: yield service.verifyPassword(email, otp),
    }).send(res);
}));
exports.forgotPassword = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password } = req.body;
    new success_response_1.OK({
        message: "Forgot password successfully",
        metaData: yield service.forgotPassword(otp, email, password),
    }).send(res);
}));
