import asyncHandle from "helpers/asyncHandle";
import { Request, Response } from "express";
import { AuthService } from "services/auth.service";
import { OK, CREATED } from "middlewares/success.response";

const service = new AuthService();

export const register = asyncHandle(async (req: Request, res: Response) => {
  const data = req.body;
  new CREATED({
    message: "Register successfully",
    metaData: await service.register(data),
  }).send(res);
});

export const login = asyncHandle(async (req: Request, res: Response) => {
  const data = req.body;
  new OK({
    message: "Login successfully",
    metaData: await service.login(data),
  }).send(res);
});

export const logout = asyncHandle(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  new OK({
    message: "Logout successfully",
    metaData: await service.logout(userId),
  }).send(res);
});

export const refreshToken = asyncHandle(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  new OK({
    message: "Refresh token successfully",
    metaData: await service.refreshToken(refreshToken),
  }).send(res);
});

export const verifyEmail = asyncHandle(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  new OK({
    message: "Verify email successfully",
    metaData: await service.verifyEmail(email, otp),
  }).send(res);
});

export const sendVerifyEmail = asyncHandle(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    new OK({
      message: "Send verify email successfully",
      metaData: await service.sendVerifyEmail(email),
    }).send(res);
  }
);
