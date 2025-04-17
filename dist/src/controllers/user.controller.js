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
exports.getUserByName = exports.getUserById = exports.changePassword = exports.deleteCoverPhoto = exports.deleteAvatar = exports.updateCoverPhoto = exports.updateAvatar = exports.updateMe = exports.getMe = exports.deleteUser = void 0;
const success_response_1 = require("../middlewares/success.response");
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const user_service_1 = require("../services/user.service");
const service = new user_service_1.UserService();
const getMe = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Get me successfully",
        metaData: yield service.getMe(userId),
    }).send(res);
}));
exports.getMe = getMe;
const updateMe = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const body = req.body;
    new success_response_1.OK({
        message: "Update me successfully",
        metaData: yield service.updateMe(userId, body),
    }).send(res);
}));
exports.updateMe = updateMe;
const updateAvatar = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { file } = req;
    new success_response_1.OK({
        message: "Update avatar successfully",
        metaData: yield service.updateAvatar(userId, file),
    }).send(res);
}));
exports.updateAvatar = updateAvatar;
const updateCoverPhoto = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { file } = req;
    new success_response_1.OK({
        message: "Update cover photo successfully",
        metaData: yield service.updateCoverPhoto(userId, file),
    }).send(res);
}));
exports.updateCoverPhoto = updateCoverPhoto;
const deleteAvatar = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Delete avatar successfully",
        metaData: yield service.deleteAvatar(userId),
    }).send(res);
}));
exports.deleteAvatar = deleteAvatar;
const deleteCoverPhoto = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Delete cover photo successfully",
        metaData: yield service.deleteCoverPhoto(userId),
    }).send(res);
}));
exports.deleteCoverPhoto = deleteCoverPhoto;
const changePassword = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const body = req.body;
    new success_response_1.OK({
        message: "Change password successfully",
        metaData: yield service.changePassword(userId, body),
    }).send(res);
}));
exports.changePassword = changePassword;
const getUserById = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    new success_response_1.OK({
        message: "Get user by id successfully",
        metaData: yield service.getMe(userId),
    }).send(res);
}));
exports.getUserById = getUserById;
const getUserByName = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword } = req.query;
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    new success_response_1.OK({
        message: "Get user by name successfully",
        metaData: yield service.findUserByName(keyword, pageNumber, limitNumber),
    }).send(res);
}));
exports.getUserByName = getUserByName;
const deleteUser = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Delete user successfully",
        metaData: yield service.deleteUser(userId),
    }).send(res);
}));
exports.deleteUser = deleteUser;
