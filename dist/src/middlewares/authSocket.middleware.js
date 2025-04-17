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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const error_response_1 = require("./error.response");
const jwt_secret = process.env.JWT_SECRET || "";
const authSocketMiddleware = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = socket.handshake.headers;
        if (!token) {
            throw new error_response_1.UnauthorizedError("Token is missing");
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
        const user = yield user_model_1.default.findById(decoded._id || decoded.id).lean(); // Tùy bạn encode token kiểu nào
        if (!user) {
            throw new error_response_1.UnauthorizedError("User not found");
        }
        if (!user.isVerified) {
            throw new error_response_1.ForbiddenError("User not verified");
        }
        if (!user.refreshToken) {
            throw new error_response_1.UnauthorizedError("User not logged in");
        }
        // Attach user info vào request để sử dụng sau
        socket.user = user;
        return next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new error_response_1.UnauthorizedError("Token expired"));
        }
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new error_response_1.UnauthorizedError("Invalid token"));
        }
        return next(err); // Pass error cho middleware xử lý lỗi chung
    }
});
exports.default = authSocketMiddleware;
