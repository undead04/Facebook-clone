import { NextFunction, Request, Response } from "express";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../middlewares/error.response";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
const jwt_secret = process.env.JWT_SECRET || "";
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("Invalid token");
  }
  const decoded = jwt.verify(
    token,
    jwt_secret,
    async (err: any, decode: any) => {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid token");
      }
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token expired");
      }
      const user = await User.findById(decode.id);
      if (!user) {
        throw new UnauthorizedError("User not found");
      }
      if (user.isVerified == false) {
        throw new ForbiddenError("User not verified");
      }
      if (user.refreshToken === "") {
        throw new UnauthorizedError("User not logged in");
      }
      return decode;
    }
  );
  (req as any).user = decoded;
  return next();
};

export default authMiddleware;
