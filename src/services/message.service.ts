import messageModel from "../models/message.model";
import { BadRequestError } from "../middlewares/error.response";
export interface IMessageInput {
  senderId: string;
  receiverId: string;
  content: string;
}
export class MessageService {
  async createMessage({ senderId, receiverId, content }: IMessageInput) {
    if (senderId === receiverId) {
      throw new BadRequestError("You cannot send message to yourself");
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      content,
    });
    (global as any)._io.to(receiverId).emit("chat message", newMessage);
    return newMessage;
  }

  async getListMessage(
    senderId: string,
    receiverId: string,
    limit: number,
    skip: number
  ) {
    const messages = await messageModel
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
  }

  async deleteMessage(messageId: string) {
    const message = await messageModel.findByIdAndDelete(messageId);
    return message;
  }

  async getListChat(userId: string) {
    const listUserChat = await messageModel.aggregate([
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
  }
}
