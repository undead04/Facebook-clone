import { Schema, model, Types } from "mongoose";

export interface IFriend extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const friendSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "unfriended"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true }); // Không cho trùng cặp bạn bè

const friendModel = model<IFriend>("Friend", friendSchema);

export default friendModel;
