import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import asyncHandle from "../helpers/asyncHandle";
import { CREATED, OK } from "../middlewares/success.response";
const service = new PostService();
export const createPost = asyncHandle(async (req: Request, res: Response) => {
  const { content, statusPost } = req.body;
  const userId = (req as any).user._id;
  const images = req.files as Express.Multer.File[];

  new CREATED({
    message: "Create post successfully",
    metaData: await service.createPost({
      userId,
      content,
      statusPost,
      images: images || [],
    }),
  }).send(res);
});

export const getPostsMe = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  new OK({
    message: "Get posts successfully",
    metaData: await service.getPosts(userId, page, limit, userId),
  }).send(res);
});

export const getPosts = asyncHandle(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const activeUserId = (req as any).user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  new OK({
    message: "Get posts successfully",
    metaData: await service.getPosts(activeUserId, page, limit, userId),
  }).send(res);
});

export const getPostById = asyncHandle(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const activeUserId = (req as any).user._id;
  new OK({
    message: "Get post successfully",
    metaData: await service.getPostById(activeUserId, postId),
  }).send(res);
});

export const updateStatusPost = asyncHandle(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const statusPost = req.body;
    const activeUserId = (req as any).user._id;
    new OK({
      message: "Update status post successfully",
      metaData: await service.updateStatusPost(
        activeUserId,
        postId,
        statusPost
      ),
    }).send(res);
  }
);

export const updatePost = asyncHandle(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const { content, statusPost } = req.body;
  const userId = (req as any).user._id;
  const images = req.files as Express.Multer.File[];
  new OK({
    message: "Update post successfully",
    metaData: await service.updatePost(userId, postId, {
      content,
      images,
      statusPost,
    }),
  }).send(res);
});

export const getPostsByCursor = asyncHandle(
  async (req: Request, res: Response) => {
    const activeUserId = (req as any).user._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    new OK({
      message: "Get posts successfully",
      metaData: await service.getPostsByCursor(activeUserId, page, limit),
    }).send(res);
  }
);
