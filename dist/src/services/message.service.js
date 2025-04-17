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
exports.MessageService = void 0;
const message_model_1 = __importDefault(require("../models/message.model"));
const error_response_1 = require("../middlewares/error.response");
class MessageService {
    createMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ senderId, receiverId, content }) {
            if (senderId === receiverId) {
                throw new error_response_1.BadRequestError("You cannot send message to yourself");
            }
            const newMessage = yield message_model_1.default.create({
                senderId,
                receiverId,
                content,
            });
            global._io.to(receiverId).emit("chat message", newMessage);
            return newMessage;
        });
    }
    getListMessage(senderId, receiverId, limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield message_model_1.default
                .find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
            return messages;
        });
    }
    deleteMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield message_model_1.default.findByIdAndDelete(messageId);
            return message;
        });
    }
    getListChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listUserChat = yield message_model_1.default.aggregate([
                // 1. Chọn các tin nhắn mà bạn tham gia
                {
                    $match: {
                        $or: [{ senderId: userId }, { receiverId: userId }],
                    },
                },
                // 2. Tạo trường "otherUser" - người chat khác
                {
                    $project: {
                        otherUser: {
                            $cond: {
                                if: { $eq: ["$senderId", userId] },
                                then: "$receiverId", // Nếu bạn là người gửi, đối tác là người nhận
                                else: "$senderId", // Nếu bạn không phải người gửi (vậy bạn là người nhận), đối tác là người gửi
                            },
                        },
                    },
                },
                {
                    $sort: { createdAt: -1 }, // sắp theo thời gian gửi mới nhất trước
                },
                // 3. Nhóm theo trường otherUser để loại bỏ những trường hợp trùng lặp
                {
                    $group: {
                        _id: "$otherUser",
                        lastMessage: { $first: "$content" },
                        lastTime: { $first: "$createdAt" },
                    },
                },
                {
                    $sort: { lastTime: -1 }, // sắp xếp người theo thời gian nhắn gần nhất
                },
                // 4. (Tùy chọn) Lookup thêm thông tin của người dùng
                {
                    $lookup: {
                        from: "users", // tên collection chứa thông tin người dùng; đảm bảo tên đúng collection trong MongoDB
                        localField: "_id", // _id ở đây chính là otherUser id
                        foreignField: "_id", // trường _id trong collection users
                        as: "userInfo",
                    },
                },
                // 5. Unwind userInfo nếu bạn muốn lấy object thay vì mảng
                {
                    $unwind: "$userInfo",
                },
                // 6. Dự án chỉ những field bạn cần (vd: id và thông tin user)
                {
                    $project: {
                        _id: 1,
                        userInfo: 1,
                    },
                },
            ]);
            return listUserChat;
        });
    }
}
exports.MessageService = MessageService;
