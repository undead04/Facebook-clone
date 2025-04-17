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
exports.getPostsByCursor = exports.updatePost = exports.updateStatusPost = exports.getPostById = exports.getPosts = exports.getPostsMe = exports.createPost = void 0;
const post_service_1 = require("../services/post.service");
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const success_response_1 = require("../middlewares/success.response");
const service = new post_service_1.PostService();
exports.createPost = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = req.user._id;
    console.log(userId, "userId");
    const images = req.files;
    new success_response_1.CREATED({
        message: "Create post successfully",
        metaData: yield service.createPost(Object.assign(Object.assign({}, body), { images, userId })),
    }).send(res);
}));
exports.getPostsMe = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    new success_response_1.OK({
        message: "Get posts successfully",
        metaData: yield service.getPosts(userId, page, limit, userId),
    }).send(res);
}));
exports.getPosts = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const activeUserId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    new success_response_1.OK({
        message: "Get posts successfully",
        metaData: yield service.getPosts(activeUserId, page, limit, userId),
    }).send(res);
}));
exports.getPostById = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const activeUserId = req.user._id;
    new success_response_1.OK({
        message: "Get post successfully",
        metaData: yield service.getPostById(activeUserId, postId),
    }).send(res);
}));
exports.updateStatusPost = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const statusPost = req.body;
    const activeUserId = req.user._id;
    new success_response_1.OK({
        message: "Update status post successfully",
        metaData: yield service.updateStatusPost(activeUserId, postId, statusPost),
    }).send(res);
}));
exports.updatePost = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const body = req.body;
    const images = req.files;
    const activeUserId = req.user._id;
    console.log(images, "images");
    new success_response_1.OK({
        message: "Update post successfully",
        metaData: yield service.updatePost(activeUserId, postId, Object.assign(Object.assign({}, body), { images })),
    }).send(res);
}));
exports.getPostsByCursor = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activeUserId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    new success_response_1.OK({
        message: "Get posts successfully",
        metaData: yield service.getPostsByCursor(activeUserId, page, limit),
    }).send(res);
}));
