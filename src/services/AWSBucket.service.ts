"use strict";

import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { s3Config as s3 } from "../configs/s3.config";
import config from "../configs/config";

export class AWSBucketService {
  // ✅ Upload file từ local (Multer)
  uploadImageFromLocal = async (file: Express.Multer.File, folder: string) => {
    try {
      const newImageName = `${folder}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: config.awsBucketName,
        Key: newImageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      return { key: newImageName };
    } catch (error) {
      throw error;
    }
  };

  // ✅ Kiểm tra ảnh có tồn tại theo URL hay không
  async existsImageByUrl(url: string): Promise<boolean> {
    try {
      const key = this.extractKeyFromUrl(url);
      const command = new HeadObjectCommand({
        Bucket: config.awsBucketName,
        Key: key,
      });
      await s3.send(command);
      return true;
    } catch (err: any) {
      if (err.name === "NotFound") return false;
      throw err;
    }
  }

  // ✅ Xóa ảnh theo URL
  async deleteImageByUrl(url: string): Promise<boolean> {
    try {
      const key = this.extractKeyFromUrl(url);
      const command = new DeleteObjectCommand({
        Bucket: config.awsBucketName,
        Key: key,
      });
      await s3.send(command);
      return true;
    } catch (err) {
      throw err;
    }
  }
  // getImage
  getImageByUrl(url: string) {
    try {
      const key = this.extractKeyFromUrl(url);
      const urlPublic = getSignedUrl({
        url: key,
        keyPairId: config.awsKeyGroup,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24), // 60s
        privateKey: config.awsPrivateKey,
      });

      return urlPublic;
    } catch (err) {
      throw err;
    }
  }
  async uploadImageFromUrl(urlImage: string) {
    try {
      const key = this.extractKeyFromUrl(urlImage);
      const command = new PutObjectCommand({
        Bucket: config.awsBucketName,
        Key: key,
      });
      await s3.send(command);
      return true;
    } catch (err) {
      throw err;
    }
  }
  // 👉 Hàm phụ để lấy key từ URL public
  private extractKeyFromUrl(url: string): string {
    return `${config.urlImagePublic}/${url}`;
  }
}
