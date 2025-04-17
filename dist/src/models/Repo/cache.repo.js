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
exports.deleteCacheID = exports.setCacheIDExprication = exports.setCacheID = exports.getCacheID = exports.cacheIDExist = void 0;
const error_response_1 = require("../../middlewares/error.response");
const init_redis_1 = __importDefault(require("../../databases/init.redis"));
const setCacheID = (_a) => __awaiter(void 0, [_a], void 0, function* ({ key, value }) {
    if (!init_redis_1.default) {
        throw new error_response_1.BadRequestError("Không có kết nối với Redis");
    }
    try {
        return yield init_redis_1.default.set(key, value);
    }
    catch (error) {
        throw error;
    }
});
exports.setCacheID = setCacheID;
const setCacheIDExprication = (_a) => __awaiter(void 0, [_a], void 0, function* ({ key, value, exp }) {
    if (!init_redis_1.default) {
        throw new error_response_1.BadRequestError("Không có kết nối với Redis");
    }
    try {
        return yield init_redis_1.default.set(key, value, "EX", exp);
    }
    catch (error) {
        throw error;
    }
});
exports.setCacheIDExprication = setCacheIDExprication;
const getCacheID = (_a) => __awaiter(void 0, [_a], void 0, function* ({ key }) {
    if (!init_redis_1.default) {
        throw new error_response_1.BadRequestError("Không có kết nối với Redis");
    }
    try {
        return yield init_redis_1.default.get(key);
    }
    catch (error) {
        throw error;
    }
});
exports.getCacheID = getCacheID;
const cacheIDExist = (_a) => __awaiter(void 0, [_a], void 0, function* ({ key }) {
    if (!init_redis_1.default) {
        throw new error_response_1.BadRequestError("Không có kết nối với Redis");
    }
    try {
        return yield init_redis_1.default.exists(key);
    }
    catch (error) {
        throw error;
    }
});
exports.cacheIDExist = cacheIDExist;
const deleteCacheID = (_a) => __awaiter(void 0, [_a], void 0, function* ({ key }) {
    if (!init_redis_1.default) {
        throw new error_response_1.BadRequestError("Không có kết nối với Redis");
    }
    try {
        return yield init_redis_1.default.del(key);
    }
    catch (error) {
        throw error;
    }
});
exports.deleteCacheID = deleteCacheID;
