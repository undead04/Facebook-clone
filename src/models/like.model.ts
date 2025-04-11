import { Types, Document, Schema, model } from "mongoose";
export interface ILike extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

const likeModel = model<ILike>("Like", likeSchema);

export default likeModel;
