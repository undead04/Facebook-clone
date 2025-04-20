import { model, Schema, Types, Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  isDelete: boolean;
  profile: {
    firstName: string;
    lastName: string;
    avatarName: string;
    coverPhotoName: string;
    bio: string;
    birthday: Date;
    gender: string;
    friendsCount: number;
  };
}
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatarName: { type: String, default: "" },
      coverPhotoName: { type: String, default: "" },
      bio: { type: String, default: "" },
      birthday: { type: Date, default: null },
      location: { type: String, default: "" },
      gender: { type: String, enum: ["male", "female", "other"] },
      friendsCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// 🎯 Thêm index full-text để tìm kiếm theo tên và bio
userSchema.index({
  "profile.firstName": "text",
  "profile.lastName": "text",
  "profile.bio": "text",
});

const userModel = model<IUser>("User", userSchema);
export default userModel;
