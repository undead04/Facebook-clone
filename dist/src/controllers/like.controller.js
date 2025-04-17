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
exports.getListLike = exports.getLikeCount = exports.unlike = exports.createLike = void 0;
const like_service_1 = require("../services/like.service");
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const success_response_1 = require("../middlewares/success.response");
const service = new like_service_1.LikeService();
exports.createLike = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { postId } = req.body;
    new success_response_1.CREATED({
        message: "Create like successfully",
        metaData: yield service.createLike(userId, postId),
    }).send(res);
}));
exports.unlike = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { postId } = req.body;
    new success_response_1.OK({
        message: "Unlike successfully",
        metaData: yield service.unlike(userId, postId),
    }).send(res);
}));
exports.getLikeCount = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    new success_response_1.OK({
        message: "Get like count successfully",
        metaData: yield service.getLikeCount(postId),
    }).send(res);
}));
exports.getListLike = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    new success_response_1.OK({
        message: "Get list like successfully",
        metaData: yield service.getListLike(postId),
    }).send(res);
}));
