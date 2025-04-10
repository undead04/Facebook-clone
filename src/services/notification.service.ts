import notificationModel from "../models/notification.model";
export class NotificationService {
  async getNotifications(userId: string) {
    const notifications = await notificationModel
      .find({ recevieId: userId })
      .populate("senderId")
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
  async updateNotification(notificationId: string) {
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
