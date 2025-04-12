import { LikeService } from "../services/like.service";
import asyncHandle from "../helpers/asyncHandle";
import { Request, Response } from "express";
import { CREATED, OK } from "../middlewares/success.response";
const service = new LikeService();

export const createLike = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { postId } = req.body;
  new CREATED({
    message: "Create like successfully",
    metaData: await service.createLike(userId, postId),
  }).send(res);
});

export const unlike = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { postId } = req.body;
  new OK({
    message: "Unlike successfully",
    metaData: await service.unlike(userId, postId),
  }).send(res);
});
export const getLikeCount = asyncHandle(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  new OK({
    message: "Get like count successfully",
    metaData: await service.getLikeCount(postId),
  }).send(res);
});
export const getListLike = asyncHandle(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  new OK({
    message: "Get list like successfully",
    metaData: await service.getListLike(postId),
  }).send(res);
});
