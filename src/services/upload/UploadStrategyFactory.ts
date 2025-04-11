import { UploadType } from "./interface/IUploadStrategy";
import { IUploadStrategy } from "./interface/IUploadStrategy";
import { PostUploadStrategy } from "./PostUploadStrategy";
import { AvatarUploadStrategy } from "./AvatarUploadStrategy";
import { CoverUploadStrategy } from "./CoverUploadStrategy";
export class UploadStrategyFactory {
  static create(type: UploadType): IUploadStrategy {
    switch (type) {
      case UploadType.POST:
        return new PostUploadStrategy();
      case UploadType.AVATAR:
        return new AvatarUploadStrategy();
      case UploadType.COVER:
        return new CoverUploadStrategy();
      default:
        throw new Error("Invalid upload type");
    }
  }
}
