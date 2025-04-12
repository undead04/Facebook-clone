import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { UnauthorizedError, ForbiddenError } from "./error.response";
import { Socket } from "socket.io";
const jwt_secret = process.env.JWT_SECRET || "";

const authSocketMiddleware = async (socket: Socket, next: NextFunction) => {
  try {
    const { token } = socket.handshake.headers;

    if (!token) {
      throw new UnauthorizedError("Token is missing");
    }

    const decoded = jwt.verify(token as string, jwt_secret) as JwtPayload;

    const user = await User.findById(decoded._id || decoded.id).lean(); // Tùy bạn encode token kiểu nào
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (!user.isVerified) {
      throw new ForbiddenError("User not verified");
    }

    if (!user.refreshToken) {
      throw new UnauthorizedError("User not logged in");
    }

    // Attach user info vào request để sử dụng sau
    (socket as any).user = user;

    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Token expired"));
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError("Invalid token"));
    }

    return next(err); // Pass error cho middleware xử lý lỗi chung
  }
};

export default authSocketMiddleware;
