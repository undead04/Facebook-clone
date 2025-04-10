import asyncHandle from "../helpers/asyncHandle";
import { Request, Response } from "express";
import { CREATED, OK } from "../middlewares/success.response";
import { FriendService } from "../services/friend.service";

const service = new FriendService();

export const createFriend = asyncHandle(async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = (req as any).user._id;
  new CREATED({
    message: "Create friend successfully",
    metaData: await service.createFriend({ userId, friendId }),
  }).send(res);
});

export const acceptFriend = asyncHandle(async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = (req as any).user._id;
  new OK({
    message: "Accept friend successfully",
    metaData: await service.acceptFriend({ userId, friendId }),
  }).send(res);
});

export const rejectFriend = asyncHandle(async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = (req as any).user._id;
  new OK({
    message: "Reject friend successfully",
    metaData: await service.rejectFriend({ userId, friendId }),
  }).send(res);
});

export const cancelFriend = asyncHandle(async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = (req as any).user._id;
  new OK({
    message: "Cancel friend successfully",
    metaData: await service.cancelFriend({ userId, friendId }),
  }).send(res);
});

export const unfriend = asyncHandle(async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = (req as any).user._id;
  new OK({
    message: "Unfriend successfully",
    metaData: await service.unfriend({ userId, friendId }),
  }).send(res);
});

export const getFriends = asyncHandle(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const userId = (req as any).user._id;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  new OK({
    message: "Get friends successfully",
    metaData: await service.getFriends(userId, pageNumber, limitNumber),
  }).send(res);
});

export const getFriendRequests = asyncHandle(
  async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const userId = (req as any).user._id;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    new OK({
      message: "Get friend requests successfully",
      metaData: await service.getFriendRequests(
        userId,
        pageNumber,
        limitNumber
      ),
    }).send(res);
  }
);

export const findByNameFriend = asyncHandle(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const { page, limit } = req.query;
    const userId = (req as any).user._id;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    new OK({
      message: "Find by name friend successfully",
      metaData: await service.findByNameFriend(
        userId,
        name,
        pageNumber,
        limitNumber
      ),
    }).send(res);
  }
);
