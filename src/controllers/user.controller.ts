import { OK } from "../middlewares/success.response";
import asyncHandle from "../helpers/asyncHandle";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
const service = new UserService();

const getMe = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  new OK({
    message: "Get me successfully",
    metaData: await service.getMe(userId),
  }).send(res);
});

const updateMe = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const body = req.body;
  new OK({
    message: "Update me successfully",
    metaData: await service.updateMe(userId, body),
  }).send(res);
});

const updateAvatar = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { file } = req;
  new OK({
    message: "Update avatar successfully",
    metaData: await service.updateAvatar(userId, file),
  }).send(res);
});

const updateCoverPhoto = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { file } = req;

  new OK({
    message: "Update cover photo successfully",
    metaData: await service.updateCoverPhoto(userId, file),
  }).send(res);
});

const deleteAvatar = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  new OK({
    message: "Delete avatar successfully",
    metaData: await service.deleteAvatar(userId),
  }).send(res);
});

const deleteCoverPhoto = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  new OK({
    message: "Delete cover photo successfully",
    metaData: await service.deleteCoverPhoto(userId),
  }).send(res);
});

const changePassword = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const body = req.body;
  new OK({
    message: "Change password successfully",
    metaData: await service.changePassword(userId, body),
  }).send(res);
});

const getUserById = asyncHandle(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  new OK({
    message: "Get user by id successfully",
    metaData: await service.getMe(userId),
  }).send(res);
});

const getUserByName = asyncHandle(async (req: Request, res: Response) => {
  const { keyword } = req.query;
  const { page, limit } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  new OK({
    message: "Get user by name successfully",
    metaData: await service.findUserByName(
      keyword as string,
      pageNumber,
      limitNumber
    ),
  }).send(res);
});

const deleteUser = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  new OK({
    message: "Delete user successfully",
    metaData: await service.deleteUser(userId),
  }).send(res);
});

export {
  deleteUser,
  getMe,
  updateMe,
  updateAvatar,
  updateCoverPhoto,
  deleteAvatar,
  deleteCoverPhoto,
  changePassword,
  getUserById,
  getUserByName,
};
