import asyncHandle from "../helpers/asyncHandle";
import { NotificationService } from "../services/notification.service";
import { OK } from "../middlewares/success.response";
import { Request, Response } from "express";
const service = new NotificationService();

export const getNotifications = asyncHandle(
  async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    new OK({
      message: "Notifications fetched successfully",
      metaData: await service.getNotifications(userId),
    }).send(res);
  }
);

export const readNotification = asyncHandle(
  async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    new OK({
      message: "Notification read successfully",
      metaData: await service.readNotification(notificationId),
    }).send(res);
  }
);

export const deleteNotification = asyncHandle(
  async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    new OK({
      message: "Notification deleted successfully",
      metaData: await service.deleteNotification(notificationId),
    }).send(res);
  }
);
