"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imagesName: { type: [String], default: [] },
    typePost: { type: String, enum: ["profile", "image"], default: "image" },
    countLike: { type: Number, default: 0 },
    countComment: { type: Number, default: 0 },
    statusPost: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public",
    },
}, { timestamps: true });
postSchema.index({ userId: 1 });
const postModel = (0, mongoose_1.model)("Post", postSchema);
exports.default = postModel;
