import { Schema, Document, model, Types } from "mongoose";
export interface INotification extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  type: string;
  content: string;
  createAt: Date;
  updateAt: Date;
  isRead: boolean;
}
const NotificationSchema = new Schema<INotification>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["friend", "like", "comment", "post"],
      required: true,
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
NotificationSchema.index({ senderId: 1, receiverId: 1 });
const notificationModel = model<INotification>(
  "Notification",
  NotificationSchema
);
export default notificationModel;
