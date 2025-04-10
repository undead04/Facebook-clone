import { BadRequestError } from "../middlewares/error.response";
import userModel from "../models/user.model";
import {
  changePasswordInput,
  updateUserInput,
} from "../validations/user/index";
import uploadImagePublish from "../messaging/uploadImagePublish";
import { comparePassword, hashPassword } from "../utils";
export class UserService {
  getMe = async (userId: string) => {
    const user = await userModel.findById(userId).lean();
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };

  updateMe = async (userId: string, data: updateUserInput) => {
    // check user exists
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    // assign data to user
    Object.assign(user, data);
    await user.save();
    return user;
  };
  updateAvatar = async (userId: string, avatar?: Express.Multer.File) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (avatar) {
      const buffer = await avatar.buffer;
      await uploadImagePublish({
        folder: "avatar",
        fileName: avatar.originalname,
        image: buffer,
      });
    }
    await user.save();
    return user;
  };
  updateCoverPhoto = async (
    userId: string,
    coverPhoto?: Express.Multer.File
  ) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (coverPhoto) {
      const buffer = await coverPhoto.buffer;
      await uploadImagePublish({
        folder: "coverPhoto",
        fileName: coverPhoto.originalname,
        image: buffer,
      });
    }
    await user.save();
    return user;
  };
  deleteAvatar = async (userId: string) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    user.profile.avatar = "";
    await user.save();
  };
  deleteCoverPhoto = async (userId: string) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    user.profile.coverPhoto = "";
    await user.save();
  };

  changePassword = async (userId: string, data: changePasswordInput) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new BadRequestError("Password is incorrect");
    }

    // check new password and confirm password
    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestError(
        "New password and confirm password do not match"
      );
    }

    // check new password is not the same as old password
    if (data.newPassword === data.password) {
      throw new BadRequestError(
        "New password cannot be the same as old password"
      );
    }

    user.password = hashPassword(data.newPassword);
    await user.save();
    return user;
  };

  findUserByName = async (keyword: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const users = await userModel
      .find(
        { $text: { $search: keyword } },
        { score: { $meta: "textScore" } } // Lấy điểm relevance
      )
      .sort({ score: { $meta: "textScore" } }) // Ưu tiên kết quả phù hợp
      .skip(skip)
      .limit(limit);

    if (!users.length) {
      throw new BadRequestError("No matching users found");
    }

    return users;
  };
}
