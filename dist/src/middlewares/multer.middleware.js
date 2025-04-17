"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDisk = exports.uploadMemory = void 0;
// src/middlewares/upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
const uploadMemory = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
exports.uploadMemory = uploadMemory;
const uploadDisk = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })
});
exports.uploadDisk = uploadDisk;
