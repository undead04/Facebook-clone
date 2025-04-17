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
exports.getFriendRequests = exports.getFriends = exports.unfriend = exports.cancelFriend = exports.rejectFriend = exports.acceptFriend = exports.createFriend = void 0;
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const success_response_1 = require("../middlewares/success.response");
const friend_service_1 = require("../services/friend.service");
const service = new friend_service_1.FriendService();
exports.createFriend = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user._id;
    new success_response_1.CREATED({
        message: "Create friend successfully",
        metaData: yield service.createFriend({ userId, friendId }),
    }).send(res);
}));
exports.acceptFriend = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Accept friend successfully",
        metaData: yield service.acceptFriend({ userId, friendId }),
    }).send(res);
}));
exports.rejectFriend = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Reject friend successfully",
        metaData: yield service.rejectFriend({ userId, friendId }),
    }).send(res);
}));
exports.cancelFriend = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Cancel friend successfully",
        metaData: yield service.cancelFriend({ userId, friendId }),
    }).send(res);
}));
exports.unfriend = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId } = req.body;
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Unfriend successfully",
        metaData: yield service.unfriend({ userId, friendId }),
    }).send(res);
}));
exports.getFriends = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const userId = req.user._id;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    new success_response_1.OK({
        message: "Get friends successfully",
        metaData: yield service.getFriends(userId, pageNumber, limitNumber),
    }).send(res);
}));
exports.getFriendRequests = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const userId = req.user._id;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    new success_response_1.OK({
        message: "Get friend requests successfully",
        metaData: yield service.getFriendRequests(userId, pageNumber, limitNumber),
    }).send(res);
}));
