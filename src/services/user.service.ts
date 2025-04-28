"use strict";
import { BadRequestError } from "../middlewares/error.response";
import userModel from "../models/user.model";
import {
  changePasswordInput,
  updateUserInput,
} from "../validations/user/index";
import {
  comparePassword,
  getInfoData,
  hashPassword,
  randomNumber,
} from "../utils";
import {
  deleteCacheID,
  setCacheIDExprication,
  getCacheID,
} from "../models/Repo/cache.repo";
import { USER } from "../models/cacheContant";
import { AWSBucketService } from "./AWSBucket.service";
import { postPublish } from "../messaging/postPublish";
import { UserRepo } from "../models/Repo/user.repo";
import { result } from "lodash";

export class UserService {
  private awsBuckset: AWSBucketService;
  private repo: UserRepo;
  constructor() {
    this.awsBuckset = new AWSBucketService();
    this.repo = new UserRepo();
  }

  getMe = async (userId: string) => {
    // Get User CaChe
    const cacheUser = await this.getCacheUser(userId);
    if (cacheUser) {
      return JSON.parse(cacheUser);
    }
    // find user DB
    const user = await userModel
      .findById(userId)
      .select(["_id", "createdAt", "profile"]);

    // set Cache
    await this.setCacheUser(userId, user);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    let userObject: any = user.toObject();
    userObject.profile.urlImageAvatar = this.awsBuckset.getImageByUrl(
      user.profile.avatarName
    );
    userObject.profile.urlImageCoverPhoto = this.awsBuckset.getImageByUrl(
      user.profile.coverPhotoName
    );
    return userObject;
  };

  updateMe = async (userId: string, data: updateUserInput) => {
    // check user exists
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // assign data to user
    Object.assign(user.profile, data);
    await user.save();

    // delete cache
    await this.deleteCacheUser(userId);

    return getInfoData(["profile"], user);
  };

  updateAvatar = async (userId: string, avatar?: Express.Multer.File) => {
    // check Exit
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // update Avatar
    if (avatar) {
      const { key } = await this.awsBuckset.uploadImageFromLocal(
        avatar,
        "avatar"
      );
      user.profile.avatarName = key;
      user.save();
      // publish post
      await postPublish({
        userId: userId,
        content: `Update Avatar`,
        imagesName: key,
        typePost: "profile",
      });
      // delete Cache
      await this.deleteCacheUser;
      const urlImageAvatar = this.awsBuckset.getImageByUrl(key);
      return {
        urlImageAvatar,
      };
    }
  };

  updateCoverPhoto = async (
    userId: string,
    coverPhoto?: Express.Multer.File
  ) => {
    // check Exit
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // update CoverPhoto
    if (coverPhoto) {
      const result = await this.awsBuckset.uploadImageFromLocal(
        coverPhoto,
        "coverPhoto"
      );
      user.profile.coverPhotoName = result.key;
      user.save();
      // publish post
      await postPublish({
        userId: userId,
        content: `Update CoverPhoto`,
        imagesName: result.key,
        typePost: "profile",
      });
      // publish notifi
    }

    // delete Cache
    await this.deleteCacheUser(userId);
    const urlImageCoverPhoto = this.awsBuckset.getImageByUrl(
      user.profile.coverPhotoName
    );
    return {
      urlImageCoverPhoto,
    };
  };

  deleteAvatar = async (userId: string) => {
    // check Exit
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    user.profile.avatarName = "";
    await user.save();

    // delete Cache
    await this.deleteCacheUser(userId);

    return { urlImageAvatar: "" };
  };

  deleteCoverPhoto = async (userId: string) => {
    // Check exit
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    user.profile.coverPhotoName = "";
    await user.save();

    // delete Cache
    await this.deleteCacheUser(userId);
    return {
      urlImageCoverPhoto: "",
    };
  };

  changePassword = async (userId: string, data: changePasswordInput) => {
    const user = await this.repo.findById(userId);

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
      .limit(limit)
      .select(["_id", "profile.firstName", "profile.lastName", "createdAt"]);

    if (!users.length) {
      throw new BadRequestError("No matching users found");
    }

    const usersObject = users.map((user) => {
      let userObject: any = user.toObject();
      userObject.profile.urlImageAvatar = this.awsBuckset.getImageByUrl(
        user.profile.avatarName
      );
      userObject.profile.urlImageCoverPhoto = this.awsBuckset.getImageByUrl(
        user.profile.coverPhotoName
      );
      return userObject;
    });
    return usersObject;
  };

  async deleteUser(userId: string) {
    await userModel.findByIdAndDelete(userId);
    await this.deleteCacheUser(userId);
  }

  private deleteCacheUser = async (userId: string) => {
    const key = `${USER}:${userId}`;
    await deleteCacheID({ key });
  };

  private setCacheUser = async (userId: string, user: any) => {
    const key = `${USER}:${userId}`;
    const value = JSON.stringify(user);
    const exp = 30 + randomNumber(10, 30);
    await setCacheIDExprication({ key, value, exp });
  };

  private getCacheUser = async (userId: string) => {
    const key = `${USER}:${userId}`;
    return await getCacheID({ key });
  };
}
