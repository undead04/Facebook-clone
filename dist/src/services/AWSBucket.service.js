'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSBucketService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const cloudfront_signer_1 = require("@aws-sdk/cloudfront-signer");
const s3_config_1 = require("../configs/s3.config");
const config_1 = __importDefault(require("../configs/config"));
class AWSBucketService {
    constructor() {
        // ✅ Upload file từ local (Multer)
        this.uploadImageFromLocal = (file, folder) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newImageName = `${folder}/${Date.now()}-${file.originalname}`;
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: config_1.default.awsBucketName,
                    Key: newImageName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                });
                const result = yield s3_config_1.s3Config.send(command);
                return { key: newImageName };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // ✅ Kiểm tra ảnh có tồn tại theo URL hay không
    existsImageByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = this.extractKeyFromUrl(url);
                const command = new client_s3_1.HeadObjectCommand({
                    Bucket: config_1.default.awsBucketName,
                    Key: key,
                });
                yield s3_config_1.s3Config.send(command);
                return true;
            }
            catch (err) {
                if (err.name === 'NotFound')
                    return false;
                throw err;
            }
        });
    }
    // ✅ Xóa ảnh theo URL
    deleteImageByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = this.extractKeyFromUrl(url);
                const command = new client_s3_1.DeleteObjectCommand({
                    Bucket: config_1.default.awsBucketName,
                    Key: key,
                });
                yield s3_config_1.s3Config.send(command);
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    // getImage
    getImageByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = this.extractKeyFromUrl(url);
                const command = new client_s3_1.GetObjectAclCommand({
                    Bucket: config_1.default.awsBucketName,
                    Key: key,
                });
                const result = yield s3_config_1.s3Config.send(command);
                const urlPublic = (0, cloudfront_signer_1.getSignedUrl)({
                    url: key,
                    keyPairId: config_1.default.awsKeyGroup,
                    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24), // 60s
                    privateKey: config_1.default.awsPrivateKey,
                });
                return {
                    url: urlPublic,
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    uploadImageFromUrl(urlImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = this.extractKeyFromUrl(urlImage);
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: config_1.default.awsBucketName,
                    Key: key,
                });
                yield s3_config_1.s3Config.send(command);
                return true;
            }
            catch (err) {
                throw err;
            }
        });
    }
    // 👉 Hàm phụ để lấy key từ URL public
    extractKeyFromUrl(url) {
        const baseUrl = config_1.default.urlImagePublic.endsWith('/')
            ? config_1.default.urlImagePublic
            : config_1.default.urlImagePublic + '/';
        return url.replace(baseUrl, '');
    }
}
exports.AWSBucketService = AWSBucketService;
