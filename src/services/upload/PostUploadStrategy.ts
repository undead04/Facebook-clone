import FirebaseStorageService from "../firebaseStorave.service";
import { IUploadStrategy } from "./interface/IUploadStrategy";
import PostModel from "../../models/post.model";
import { NotFoundError } from "../../middlewares/error.response";
export class PostUploadStrategy implements IUploadStrategy {
  async upload(file: Express.Multer.File[], id: string) {
    if (Array.isArray(file)) {
      // check post exist
      const post = await PostModel.findById(id);
      if (!post) throw new NotFoundError("Post not found");

      const result = await Promise.all(
        file.map((f) =>
          FirebaseStorageService.uploadBuffer(
            Buffer.from(f.buffer),
            `posts/${f.originalname}`
          )
        )
      );
      post.imagesUrl.push(...result.map((r) => r.url));
      post.imagesName.push(...result.map((r) => r.filePath));

      await post.save();
      return post;
    }
    return [];
  }
}
