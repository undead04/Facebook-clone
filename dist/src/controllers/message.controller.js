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
exports.getListChat = exports.deleteMessage = exports.getListMessage = exports.createMessage = void 0;
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const success_response_1 = require("../middlewares/success.response");
const message_service_1 = require("../services/message.service");
const service = new message_service_1.MessageService();
exports.createMessage = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;
    new success_response_1.OK({
        message: "Message created successfully",
        metaData: yield service.createMessage({ senderId, receiverId, content }),
    }).send(res);
}));
exports.getListMessage = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, limit, skip } = req.body;
    new success_response_1.OK({
        message: "List message fetched successfully",
        metaData: yield service.getListMessage(senderId, receiverId, limit, skip),
    }).send(res);
}));
exports.deleteMessage = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.body;
    new success_response_1.OK({
        message: "Message deleted successfully",
        metaData: yield service.deleteMessage(messageId),
    }).send(res);
}));
exports.getListChat = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "List chat fetched successfully",
        metaData: yield service.getListChat(userId),
    }).send(res);
}));
