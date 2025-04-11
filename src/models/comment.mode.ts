"use strict";
import { Schema, model, Types, Document } from "mongoose";
export interface IComment extends Document {
  comment_productId: Types.ObjectId;
  comment_userId: Types.ObjectId;
  comment_content: string;
  comment_left: number;
  comment_right: number;
  comment_parent: Types.ObjectId;
  isDeleted: boolean;
}
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
const commentSchema = new Schema<IComment>(
  {
    comment_productId: { type: Schema.Types.ObjectId, required: true },
    comment_userId: { type: Schema.Types.ObjectId, required: true },
    comment_content: { type: String, required: true },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parent: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Schema.Types.Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const commentModel = model<IComment>(DOCUMENT_NAME, commentSchema);
export default commentModel;
