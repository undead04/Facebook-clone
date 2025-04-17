'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Config = exports.DeleteObjectCommand = exports.GetObjectCommand = exports.PutObjectCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
Object.defineProperty(exports, "PutObjectCommand", { enumerable: true, get: function () { return client_s3_1.PutObjectCommand; } });
Object.defineProperty(exports, "GetObjectCommand", { enumerable: true, get: function () { return client_s3_1.GetObjectCommand; } });
Object.defineProperty(exports, "DeleteObjectCommand", { enumerable: true, get: function () { return client_s3_1.DeleteObjectCommand; } });
const config_1 = __importDefault(require("../configs/config"));
const s3Config = new client_s3_1.S3Client({
    region: config_1.default.awsRegion,
    credentials: {
        accessKeyId: config_1.default.awsAccessKeyId || "",
        secretAccessKey: config_1.default.awsSecretAccessKey || ""
    }
});
exports.s3Config = s3Config;
