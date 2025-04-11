import FirebaseStorageService from "../firebaseStorave.service";
import { IUploadStrategy } from "./interface/IUploadStrategy";
import UserModel from "../../models/user.model";
import { NotFoundError } from "../../middlewares/error.response";
export class AvatarUploadStrategy implements IUploadStrategy {
  async upload(file: Express.Multer.File[], id: string) {
    if (Array.isArray(file)) {
      const user = await UserModel.findById(id);
      //check if user has avatar
      if (!user) throw new NotFoundError("User not found");
      const filePath = user.profile.avatarName;
      if (filePath) {
        if (await FirebaseStorageService.fileExists(filePath)) {
          await FirebaseStorageService.deleteFile(filePath);
          console.log("Delete file success");
        }
      }
      const result = await Promise.all(
        file.map((f) =>
          FirebaseStorageService.uploadBuffer(
            Buffer.from(f.buffer),
            `avatar/${f.originalname}`
          )
        )
      );
      user.profile.avatarName = result[0].filePath;
      user.profile.avatarUrl = result[0].url;
      await user.save();
      return user;
    }
    return [];
  }
}
