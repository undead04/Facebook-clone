import {
  ICreatePost,
  PostInput,
  UpdateStatusPostInput,
} from "../validations/post/PostInput";
import postModel from "../models/post.model";
import userModel from "../models/user.model";
import friendModel from "../models/friend.model";
import { ForbiddenError, NotFoundError } from "../middlewares/error.response";
import uploadImagePublish from "../messaging/uploadImagePublish";
import { UploadType } from "../services/upload/interface/IUploadStrategy";
import { Types } from "mongoose";
export class PostService {
  async createPost({ userId, content, images, statusPost }: ICreatePost) {
    // check user
    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const newPost = await postModel.create({
      userId,
      content,
      statusPost,
    });
    // upload images rabbitmq
    if (images) {
      if (images.length > 0) {
        await uploadImagePublish({
          type: UploadType.POST,
          files: images,
          id: newPost._id.toString(),
        });
      }
    }
    return "Create post successfully";
  }
  async getPosts(
    activeUserId: Types.ObjectId,
    page: number,
    limit: number,
    userId: string
  ) {
    const skip = (page - 1) * limit;
    // 1. Lấy thông tin người đăng bài và người đang xem
    const [user, activeUser, userFriend] = await Promise.all([
      userModel.findById(userId),
      userModel.findById(activeUserId),
      friendModel.findOne({
        $or: [
          { userId: activeUserId, friendId: userId },
          { userId, friendId: activeUserId },
        ],
      }),
    ]);

    if (!user) throw new NotFoundError("User not found");
    if (!activeUser) throw new NotFoundError("Active user not found");

    // 2. Tính quyền xem bài viết
    let visibilityFilter: any = {};
    if (activeUserId.toString() === userId) {
      // Là chính mình => xem tất cả
      visibilityFilter = {};
    } else if (userFriend && userFriend.status === "accepted") {
      // Là bạn bè => xem bài public và friends
      visibilityFilter = { statusPost: { $in: ["public", "friends"] } };
    } else {
      // Người lạ => chỉ xem bài public
      visibilityFilter = { statusPost: "public" };
    }
    // 3. Tìm bài viết
    const posts = await postModel
      .find({
        userId,
        ...visibilityFilter,
      })
      .populate({
        path: "userId",
        select: "profile.avatarUrl profile.firstName profile.lastName _id",
      })
      .select([
        "_id",
        "userId",
        "imagesUrl",
        "imagesName",
        "content",
        "countLike",
        "countComment",
        "statusPost",
        "createdAt",
        "updatedAt",
      ])
      .sort({ createdAt: -1 }) // gợi ý: sắp xếp mới nhất trước
      .skip(skip)
      .limit(limit)
      .lean();

    return posts;
  }

  async getPostById(activeUserId: Types.ObjectId, postId: string) {
    // 1. Lấy thông tin người đăng bài và người đang xem
    const post = await postModel.findById(postId);
    if (!post) throw new NotFoundError("Post not found");

    const userId = post.userId;
    const userFriend = await friendModel.findOne({
      $or: [
        { userId: activeUserId, friendId: userId },
        { userId, friendId: activeUserId },
      ],
    });

    // 2. Tính quyền xem bài viết
    let statusPost = [];
    if (activeUserId.toString() === userId.toString()) {
      // Là chính mình => xem tất cả
      statusPost = ["public", "friends", "private"];
    } else if (userFriend && userFriend.status === "accepted") {
      // Là bạn bè => xem bài public và friends
      statusPost = ["public", "friends"];
    } else {
      // Người lạ => chỉ xem bài public
      statusPost = ["public"];
    }

    if (!statusPost.includes(post.statusPost)) {
      throw new ForbiddenError("You are not allowed to see this post");
    }

    return post;
  }
  async updateStatusPost(
    activeUserId: string,
    postId: string,
    { statusPost }: UpdateStatusPostInput
  ) {
    // check post
    const post = await postModel.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    // check user
    const user = await userModel.findById(activeUserId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // check user is owner post
    if (post.userId.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not allowed to update this post");
    }
    // update status post
    post.statusPost = statusPost;
    await post.save();
    return post;
  }
  async updatePost(
    activeUser: Types.ObjectId,
    postId: string,
    { content, images }: PostInput
  ) {
    // check post
    const post = await postModel.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    // check user
    const user = await userModel.findById(activeUser);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    // check user is owner post
    if (post.userId.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not allowed to update this post");
    }
    // update post
    post.content = content;
    // upload images rabbitmq
    if (images) {
      if (images.length > 0) {
        await uploadImagePublish({
          type: UploadType.POST,
          files: images,
          id: postId,
        });
      }
    }
    await post.save();
    return "Update post successfully";
  }

  async getPostsByCursor(
    activeUserId: Types.ObjectId,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const activeUser = await userModel.findById(activeUserId);
    if (!activeUser) throw new NotFoundError("Active user not found");
    const friends = await friendModel.find({
      $or: [
        { userId: activeUserId, status: "accepted" },
        { friendId: activeUserId, status: "accepted" },
      ],
    });
    const posts = await postModel.aggregate([
      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                { case: { $eq: ["$userId", activeUser._id] }, then: 3 },
                { case: { $in: ["$userId", friends] }, then: 2 },
                { case: { $eq: ["$statusPost", "public"] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { userId: activeUser._id },
            { userId: { $in: friends } },
            { visibility: "public" },
          ],
        },
      },
      {
        $sort: { priority: -1, likes: -1, createdAt: -1 },
        // Ưu tiên bài của mình > bạn bè > public
        // Trong cùng nhóm thì bài nào nhiều like hơn lên trước
        // Có thể thêm sort theo createdAt nếu cần
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    return posts;
  }
}
