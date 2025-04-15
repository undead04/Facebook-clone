import commentModel from "../models/comment.model";
import postModel from "../models/post.model";
import { Types } from "mongoose";
import { NotFoundError } from "../middlewares/error.response";
import friendModel from "../models/friend.model";
export class CommentService {
  async createComment(
    postId: string,
    userId: Types.ObjectId,
    content: string,
    parentCommentId = null
  ) {
    // check post
    const post = await postModel.findById(postId);
    if (!post) throw new NotFoundError("post not found");
    // create comment
    const comment = new commentModel({
      comment_postId: postId,
      comment_userId: userId,
      comment_content: content,
      comment_parent: parentCommentId,
    });
    // update comment_left and comment_right
    let rightValue = 0;
    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("parent comment not found");
      rightValue = parentComment.comment_right;
      // updateMany comments
      await commentModel.updateMany(
        {
          comment_postId: postId,
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await commentModel.updateMany(
        {
          comment_postId: postId,
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne({
        comment_postId: postId,
      });
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    post.countComment += 1;

    await post.save();
    await comment.save();

    // 2. Kiểm tra quan hệ bạn bè
    let friend;
    if (post.userId.toString() !== userId.toString()) {
      friend = await friendModel
        .findOne({
          $or: [
            { userId: userId, friendId: post.userId },
            { userId: post.userId, friendId: userId },
          ],
        })
        .lean();
    }

    // publish notification
    if (friend) {
    }
    return comment;
  }
  async getCommentsByParentId(
    postId: string,
    parentCommentId: string | null,
    limit = 10,
    skip = 0
  ) {
    // check post
    const post = await postModel.findById(postId);
    if (!post) throw new NotFoundError("post not found");

    // get comments
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("parent comment not found");

      const comments = await commentModel
        .find({
          comment_postId: postId,
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parent: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await commentModel
      .find({
        comment_postId: postId,
        comment_parent: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parent: 1,
      })
      .sort({
        comment_left: 1,
      });
    return comments;
  }
  async deleteComments(commentId: string, postId: string) {
    // check post
    const post = await postModel.findById(postId);
    if (!post) throw new NotFoundError("post not found");

    // check comment
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("comment not found");

    // tinh width
    const width = comment.comment_right - comment.comment_left + 1;
    await commentModel.deleteMany({
      comment_postId: postId,
      comment_left: { $gte: comment.comment_left, $lt: comment.comment_right },
    });
    await commentModel.updateMany(
      {
        comment_postId: postId,
        comment_right: { $gt: comment.comment_right },
      },
      {
        $inc: { comment_right: -width },
      }
    );
    await commentModel.updateMany(
      {
        comment_postId: postId,
        comment_left: { $gt: comment.comment_right },
      },
      {
        $inc: { comment_left: -width },
      }
    );
    return true;
  }
}
