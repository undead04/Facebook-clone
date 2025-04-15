"use strict";

import { BadRequestError } from "../../middlewares/error.response";
import redisClient from "../../databases/init.redis";

const setCacheID = async ({ key, value }: { key: string; value: string }) => {
  if (!redisClient) {
    throw new BadRequestError("Không có kết nối với Redis");
  }
  try {
    return await redisClient.set(key, value);
  } catch (error) {
    throw error
  }
};
const setCacheIDExprication = async ({ key, value, exp }:{key: string; value: string; exp: number}) => {
  if (!redisClient) {
    throw new BadRequestError("Không có kết nối với Redis");
  }
  try {
    return await redisClient.set(key, value, "EX", exp);
  } catch (error) {
    throw error
  }
};

const getCacheID = async ({ key }:{key:string}) => {
  if (!redisClient) {
    throw new BadRequestError("Không có kết nối với Redis");
  }
  try {
    return await redisClient.get(key);
  } catch (error) {
    throw error
  }
};

const cacheIDExist = async({key}:{key:string})=>{
  if (!redisClient) {
    throw new BadRequestError("Không có kết nối với Redis");
  }
  try {
    return await redisClient.exists(key);
  } catch (error) {
    throw error
  }
}

const deleteCacheID = async({key}:{key:string})=>{
  if (!redisClient) {
    throw new BadRequestError("Không có kết nối với Redis");
  }
  try {
    return await redisClient.del(key);
  } catch (error) {
    throw error
  }
}
export {cacheIDExist,getCacheID, setCacheID, setCacheIDExprication,deleteCacheID};
