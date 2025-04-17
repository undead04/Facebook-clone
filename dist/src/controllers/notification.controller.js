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
exports.deleteNotification = exports.readNotification = exports.getNotifications = void 0;
const asyncHandle_1 = __importDefault(require("../helpers/asyncHandle"));
const notification_service_1 = require("../services/notification.service");
const success_response_1 = require("../middlewares/success.response");
const service = new notification_service_1.NotificationService();
exports.getNotifications = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    new success_response_1.OK({
        message: "Notifications fetched successfully",
        metaData: yield service.getNotifications(userId),
    }).send(res);
}));
exports.readNotification = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationId } = req.params;
    new success_response_1.OK({
        message: "Notification read successfully",
        metaData: yield service.readNotification(notificationId),
    }).send(res);
}));
exports.deleteNotification = (0, asyncHandle_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationId } = req.params;
    new success_response_1.OK({
        message: "Notification deleted successfully",
        metaData: yield service.deleteNotification(notificationId),
    }).send(res);
}));
