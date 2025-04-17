"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["friend", "like", "comment", "post"],
        required: true,
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true,
});
NotificationSchema.index({ senderId: 1, receiverId: 1 });
const notificationModel = (0, mongoose_1.model)("Notification", NotificationSchema);
exports.default = notificationModel;
