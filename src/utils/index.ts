import dotenv from "dotenv";
import { BadRequestError, UnauthorizedError } from "middlewares/error.response";
import userModel from "models/user.model";
("use strict");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

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
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    JWT_SECRET,
    async (err: any, decoded: any) => {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new BadRequestError("Invalid token");
      }

      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token expired");
      }

      const user = await userModel.findById(decoded.id).lean();
      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      return decoded;
    }
  );
  return decoded;
};

export {
  getInfoData,
  getSelectData,
  unSelectData,
  hashPassword,
  comparePassword,
  generateOTP,
  createAccessToken,
  createRefreshToken,
  verifyToken,
};
