import * as express from "express";

export interface IUploadStrategy {
  upload(file: Express.Multer.File[], id: string): Promise<any>;
}
export enum UploadType {
  POST = "post",
  AVATAR = "avatar",
  COVER = "cover-photo",
}
