"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const friendSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled", "unfriended"],
        default: "pending",
    },
}, {
    timestamps: true,
});
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true }); // Không cho trùng cặp bạn bè
const friendModel = (0, mongoose_1.model)("Friend", friendSchema);
exports.default = friendModel;
