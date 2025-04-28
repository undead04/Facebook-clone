import {
  ICreatePost,
  PostInput,
  UpdateStatusPostInput,
} from "../validations/post/PostInput";
import postModel from "../models/post.model";
import userModel from "../models/user.model";
import friendModel from "../models/friend.model";
import { ForbiddenError, NotFoundError } from "../middlewares/error.response";
import { Types } from "mongoose";
import { UserRepo } from "../models/Repo/user.repo";
import { AWSBucketService } from "./AWSBucket.service";

export class PostService {
  private userRepo = new UserRepo();
  private awsService = new AWSBucketService();
  async createPost({ userId, content, images, statusPost }: ICreatePost) {
    // check user
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const newPost = await postModel.create({
      userId,
      content,
      statusPost,
    });
    if (images) {
      if (images.length > 0) {
        const result = await this.awsService.uploadImagesFromLocal(
          images,
          "post"
        );
        const imagesName = result.map((item) => item.key);
        newPost.imagesName = imagesName;
        newPost.save();
      }
    }
    return newPost;
  }

  async getPosts(
    activeUserId: string,
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
    if (activeUserId.toString() === userId.toString()) {
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
        select: "profile.firstName profile.lastName profile.urlImageAvatar _id",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return posts.map((post: any) => {
      return this.selectPost(post);
    });
  }

  async getPostById(activeUserId: string, postId: string) {
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

    return this.selectPost(post);
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
    { content, images, statusPost }: PostInput
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
    Object.assign({ content, statusPost }, post);

    if (images) {
      if (images.length > 0) {
        await this.awsService.deleteImagesByUrl(post.imagesName);
        const result = await this.awsService.uploadImagesFromLocal(
          images,
          "post"
        );
        const imagesName = result.map((item) => item.key);
        post.imagesName = imagesName;
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

    return posts.map((post) => {
      return this.selectPost(post);
    });
  }
  private selectPost(post: any) {
    return {
      _id: post._id,
      userId: {
        _id: post.userId._id,
        firstName: post.userId.firstName,
        lastName: post.userId.lastName,
        urlImagesAvatar: this.awsService.getImageByUrl(post.userId.avatarName),
      },
      content: post.content,
      createAt: post.createdAt,
      countLike: post.countLike,
      countComment: post.countComment,
      urlImages:
        post.imagesName && post.imagesName.length > 0
          ? this.awsService.getImagesByUrl(post.imagesName)
          : [],
    };
  }
}
