"use strict";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middlewares/error.response";
import userModel from "../models/user.model";
import config from "../configs/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";
import ms from "ms";
import crypto from "crypto";
const JWT_SECRET = config.jwtSecret;

const getInfoData = (fileds: string[], data: any) => _.pick(data, fileds);

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const comparePassword = (password: string, hashPassword: string) => {
  return bcrypt.compareSync(password, hashPassword);
};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createAccessToken = (userId: string) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: config.jwtExpiration as ms.StringValue,
  });
};

const createRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: config.jwtRefreshTokenExpiration as ms.StringValue,
  });
};

const parseBoolean = (value: string | boolean) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return false;
};

const verifyToken = async (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err instanceof jwt.TokenExpiredError) {
        return reject(new UnauthorizedError("Token expired"));
      }

      if (err instanceof jwt.JsonWebTokenError) {
        return reject(new BadRequestError("Invalid token"));
      }

      const payload = decoded as JwtPayload;
      const user = await userModel.findById(payload._id).lean();

      if (!user) {
        return reject(new UnauthorizedError("User not found"));
      }

      resolve(payload);
    });
  });
};

const getFilePathFromUrl = (url: string): string | null => {
  const match = url.match(/\/([^\/]+\/[^\/]+\.\w+)$/);
  return match ? match[1] : null;
};

const stringToBitIndex = (userId: string): number => {
  const hash = crypto.createHash("md5").update(userId).digest("hex");
  return parseInt(hash.slice(0, 8), 16); // lấy 32-bit integer
};

const randomNumber = (min:number,max:number):number =>{
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export {
  sleep,
  randomNumber,
  getFilePathFromUrl,
  getInfoData,
  getSelectData,
  unSelectData,
  hashPassword,
  comparePassword,
  generateOTP,
  createAccessToken,
  createRefreshToken,
  verifyToken,
  parseBoolean,
  stringToBitIndex,
};
