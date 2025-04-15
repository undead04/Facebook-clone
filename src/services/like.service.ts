import { BadRequestError, NotFoundError } from "../middlewares/error.response";
import postModel from "../models/post.model";
import likeModel from "../models/like.model";
import mongoose, { Types } from "mongoose";
import redisClient from "../databases/init.redis";
import friendModel from "../models/friend.model";
import { stringToBitIndex } from "../utils/index";
export class LikeService {
  async createLike(activeUserId: Types.ObjectId, postId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. Tìm bài viết (KHÔNG dùng lean để còn .save())
      const post = await postModel.findById(postId).session(session);
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // 2. Kiểm tra quan hệ bạn bè
      let friend;
      if (post.userId.toString() !== activeUserId.toString()) {
        friend = await friendModel
          .findOne({
            $or: [
              { userId: activeUserId, friendId: post.userId },
              { userId: post.userId, friendId: activeUserId },
            ],
          })
          .session(session)
          .lean();
      }

      // 3. Kiểm tra đã like chưa (bằng Redis bitmap)
      const bitIndex = stringToBitIndex(activeUserId.toString());
      const isLiked = await this.handleLikeExitRedis(postId, bitIndex);
      if (isLiked) {
        throw new BadRequestError("You already liked this post");
      }

      // 4. Ghi like vào DB
      await likeModel.create(
        [
          {
            postId,
            userId: activeUserId,
          },
        ],
        { session }
      );

      // 5. Ghi like vào Redis bitmap
      await this.handleLikeRedis(postId, bitIndex);

      // 6. Tăng đếm like trong Redis
      await redisClient.incr(`post:${postId}:like:count`);

      // 7. Cập nhật countLike trong DB
      post.countLike += 1;
      await post.save({ session });

      // 6. Commit DB transaction
      await session.commitTransaction();
      session.endSession();

      // 8. Gửi thông báo nếu là bạn bè
      if (friend) {
        
      }

      return "Liked Successfully";
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async unlike(activeUserId: Types.ObjectId, postId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // check post
      const post = await postModel.findById(postId).session(session);
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      const bitIndex = stringToBitIndex(activeUserId.toString());
      const isLiked = await this.handleLikeExitRedis(postId, bitIndex);

      if (!isLiked) {
        throw new BadRequestError("You have not liked this post");
      }

      await likeModel.deleteOne(
        {
          userId: activeUserId,
          postId,
        },
        { session }
      );

      post.countLike -= 1;
      await post.save({ session });
      await session.commitTransaction();
      session.endSession();
      await this.handleUnlikeRedis(postId, bitIndex);
      // Redis: giảm đếm like
      await redisClient.decr(`post:${postId}:like:count`);

      return "Unliked Successfully";
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
  // === ĐỒNG BỘ LẠI REDIS từ MongoDB nếu Redis bị mất ===
  async syncLikesFromDBToRedis(postId: string) {
    const likes = await likeModel.find({ postId }).lean();
    const key = `post:${postId}:like`;

    for (const like of likes) {
      const bitIndex = stringToBitIndex(like.userId.toString());
      await redisClient.setbit(key, bitIndex, 1);
    }

    // cập nhật lại count
    await redisClient.set(`${key}:count`, likes.length.toString());
    return "Sync completed";
  }

  // === Đếm like (ưu tiên Redis) ===
  async getLikeCount(postId: string): Promise<number> {
    const count = await redisClient.get(`post:${postId}:like:count`);
    if (count !== null) return parseInt(count);
    // Nếu Redis chưa có → đồng bộ lại
    await this.syncLikesFromDBToRedis(postId);
    return parseInt(
      (await redisClient.get(`post:${postId}:like:count`)) || "0"
    );
  }
  async getListLike(postId: string) {
    const likes = await likeModel
      .find({ postId })
      .populate({
        path: "userId",
        select: "profile.firstName profile.lastName profile.avatarUrl _id",
      })
      .lean();
    return likes;
  }

  private async handleLikeRedis(postId: string, bitIndex: number) {
    await redisClient.setbit(`post:${postId}:like`, bitIndex, 1);
  }

  private async handleUnlikeRedis(postId: string, bitIndex: number) {
    await redisClient.setbit(`post:${postId}:like`, bitIndex, 0);
  }

  private async handleLikeCountRedis(postId: string) {
    const count = await likeModel.countDocuments({ postId });
    await redisClient.set(`post:${postId}:like:count`, count.toString());
  }

  private async handleLikeExitRedis(postId: string, bitIndex: number) {
    const isLiked = await redisClient.getbit(`post:${postId}:like`, bitIndex);
    return isLiked === 1;
  }
}
