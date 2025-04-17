"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
const commentSchema = new mongoose_1.Schema({
    comment_postId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    comment_userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    comment_content: { type: String, required: true },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parent: { type: mongoose_1.Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: mongoose_1.Schema.Types.Boolean, default: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
const commentModel = (0, mongoose_1.model)(DOCUMENT_NAME, commentSchema);
exports.default = commentModel;
