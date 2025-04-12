import notificationModel from "../models/notification.model";
export class NotificationService {
  async getNotifications(userId: string) {
    const notifications = await notificationModel
      .find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .lean();
    return notifications;
  }

  async getNotificationById(notificationId: string) {
    const notification = await notificationModel
      .findById(notificationId)
      .populate("senderId")
      .lean();
    return notification;
  }

  async readNotification(notificationId: string) {
    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { $set: { isRead: true } },
      { new: true }
    );
    return notification;
  }

  async deleteNotification(notificationId: string) {
    const notification = await notificationModel.findByIdAndDelete(
      notificationId
    );
    return notification;
  }
}
