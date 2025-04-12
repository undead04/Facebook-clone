import asyncHandle from "helpers/asyncHandle";
import { OK } from "middlewares/success.response";
import { MessageService } from "services/message.service";
import { Request, Response } from "express";
const service = new MessageService();

export const createMessage = asyncHandle(
  async (req: Request, res: Response) => {
    const { senderId, receiverId, content } = req.body;
    new OK({
      message: "Message created successfully",
      metaData: await service.createMessage({ senderId, receiverId, content }),
    }).send(res);
  }
);

export const getListMessage = asyncHandle(
  async (req: Request, res: Response) => {
    const { senderId, receiverId, limit, skip } = req.body;
    new OK({
      message: "List message fetched successfully",
      metaData: await service.getListMessage(senderId, receiverId, limit, skip),
    }).send(res);
  }
);

export const deleteMessage = asyncHandle(
  async (req: Request, res: Response) => {
    const { messageId } = req.body;
    new OK({
      message: "Message deleted successfully",
      metaData: await service.deleteMessage(messageId),
    }).send(res);
  }
);

export const getListChat = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.body;
  new OK({
    message: "List chat fetched successfully",
    metaData: await service.getListChat(userId),
  }).send(res);
});
