import { Schema, Types, model, Document } from "mongoose";

export interface IPost extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  imagesName: string[];
  imagesUrl: string[];
  countLike: number;
  countComment: number;
  createdAt: Date;
  updatedAt: Date;
  statusPost: string;
}

const postSchema = new Schema<IPost>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imagesName: { type: [String], default: [] },
    imagesUrl: { type: [String], default: [] },
    countLike: { type: Number, default: 0 },
    countComment: { type: Number, default: 0 },
    statusPost: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

postSchema.index({ userId: 1 });

const postModel = model<IPost>("Post", postSchema);

export default postModel;
