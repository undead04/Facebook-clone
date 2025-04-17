"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: Number(process.env.PORT) || 3000,
    mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/social-network",
    jwtSecret: process.env.JWT_SECRET || "secret",
    jwtExpiration: process.env.JWT_EXPIRATION || "1h",
    jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d",
    emailHost: process.env.EMAIL_HOST || "smtp.gmail.com",
    emailPort: Number(process.env.EMAIL_PORT) || 587,
    emailUser: process.env.EMAIL_USER || "your-email@gmail.com",
    emailPassword: process.env.EMAIL_PASSWORD || "your-email-password",
    emailSecure: false,
    redisHost: process.env.REDIS_HOST || "localhost",
    redisPort: Number(process.env.REDIS_PORT) || 6379,
    redisPassword: process.env.REDIS_PASSWORD || "",
    rabbitMQUrl: process.env.RABBITMQ_URL || "amqp://localhost",
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    fontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    awsRegion: process.env.AWS_REGION || "us-east-1",
    awsAccessKeyId: process.env.AWS_BUCKET_ACESS_KEY || "AKIAIOSFODNN7EXAMPLE",
    awsSecretAccessKey: process.env.AWS_BUCKET_SECRET_KEY || "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    awsBucketName: process.env.AWS_BUCKET_NAME || "my-bucket-name",
    awsKeyGroup: process.env.AWS_KEY_GROUP || "my-key-group",
    awsPrivateKey: process.env.AWS_PRIVATE_KEY || "my-private-key",
    urlImagePublic: process.env.URL_IMAGE_PUBLIC || "https://my-bucket-name.s3.amazonaws.com/"
};
exports.default = config;
