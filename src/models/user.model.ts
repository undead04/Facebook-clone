import { model, Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarName: string;
    coverPhotoName: string;
    avatarUrl: string;
    coverPhotoUrl: string;
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
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatarName: { type: String, default: "" },
      coverPhotoName: { type: String, default: "" },
      avatarUrl: { type: String, default: "" },
      coverPhotoUrl: { type: String, default: "" },
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
