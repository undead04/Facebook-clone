import { CREATED, OK } from "../middlewares/success.response";
import { CommentService } from "../services/comment.service";
import asyncHandle from "../helpers/asyncHandle";
import { Request, Response } from "express";
const service = new CommentService();

export const createComment = asyncHandle(
  async (req: Request, res: Response) => {
    const { postId, content, parentCommentId } = req.body;
    const userId = (req as any).user._id;
    new CREATED({
      message: "Comment created successfully",
      metaData: await service.createComment(
        postId,
        userId,
        content,
        parentCommentId
      ),
    }).send(res);
  }
);

export const getCommentsByParentId = asyncHandle(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const parentCommentId = req.query.parentCommentId
      ? (req.query.parentCommentId as string)
      : null;
    const userId = (req as any).user._id;
    new OK({
      message: "Comments fetched successfully",
      metaData: await service.getCommentsByParentId(
        postId,
        parentCommentId,
        userId
      ),
    }).send(res);
  }
);

export const deleteComment = asyncHandle(
  async (req: Request, res: Response) => {
    const { commentId, postId } = req.body;
    const userId = (req as any).user._id;
    new OK({
      message: "Comment deleted successfully",
      metaData: await service.deleteComments(commentId, postId),
    }).send(res);
  }
);
