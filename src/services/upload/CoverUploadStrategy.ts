import FirebaseStorageService from "../firebaseStorave.service";
import { IUploadStrategy } from "./interface/IUploadStrategy";
import UserModel from "../../models/user.model";
import { NotFoundError } from "../../middlewares/error.response";
export class CoverUploadStrategy implements IUploadStrategy {
  async upload(file: Express.Multer.File[], id: string) {
    if (Array.isArray(file)) {
      const user = await UserModel.findById(id);
      //check if user has avatar
      if (!user) throw new NotFoundError("User not found");
      const filePath = user.profile.coverPhotoName;

      if (filePath) {
        if (await FirebaseStorageService.fileExists(filePath)) {
          await FirebaseStorageService.deleteFile(filePath);
          console.log("Delete file success");
        } else {
          console.log("File not found");
        }
      }
      const result = await Promise.all(
        file.map((f) =>
          FirebaseStorageService.uploadBuffer(
            Buffer.from(f.buffer),
            `cover-photo/${f.originalname}`
          )
        )
      );
      user.profile.coverPhotoName = result[0].filePath;
      user.profile.coverPhotoUrl = result[0].url;
      await user.save();
      return user;
    }
    return [];
  }
}
