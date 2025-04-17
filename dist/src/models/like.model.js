"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
}, { timestamps: true });
likeSchema.index({ userId: 1, postId: 1 });
const likeModel = (0, mongoose_1.model)("Like", likeSchema);
exports.default = likeModel;
