"use strict";
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
exports.stringToBitIndex = exports.parseBoolean = exports.verifyToken = exports.createRefreshToken = exports.createAccessToken = exports.generateOTP = exports.comparePassword = exports.hashPassword = exports.unSelectData = exports.getSelectData = exports.getInfoData = exports.getFilePathFromUrl = exports.randomNumber = exports.sleep = void 0;
const error_response_1 = require("../middlewares/error.response");
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = __importDefault(require("../configs/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = config_1.default.jwtSecret;
const getInfoData = (fileds, data) => lodash_1.default.pick(data, fileds);
exports.getInfoData = getInfoData;
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 1]));
};
exports.getSelectData = getSelectData;
const unSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 0]));
};
exports.unSelectData = unSelectData;
const hashPassword = (password) => {
    return bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hashPassword) => {
    return bcrypt_1.default.compareSync(password, hashPassword);
};
exports.comparePassword = comparePassword;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const createAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ _id: userId }, JWT_SECRET, {
        expiresIn: config_1.default.jwtExpiration,
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ _id: userId }, JWT_SECRET, {
        expiresIn: config_1.default.jwtRefreshTokenExpiration,
    });
};
exports.createRefreshToken = createRefreshToken;
const parseBoolean = (value) => {
    if (typeof value === "boolean")
        return value;
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    return false;
};
exports.parseBoolean = parseBoolean;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return reject(new error_response_1.UnauthorizedError("Token expired"));
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return reject(new error_response_1.BadRequestError("Invalid token"));
            }
            const payload = decoded;
            const user = yield user_model_1.default.findById(payload._id).lean();
            if (!user) {
                return reject(new error_response_1.UnauthorizedError("User not found"));
            }
            resolve(payload);
        }));
    });
});
exports.verifyToken = verifyToken;
const getFilePathFromUrl = (url) => {
    const match = url.match(/\/([^\/]+\/[^\/]+\.\w+)$/);
    return match ? match[1] : null;
};
exports.getFilePathFromUrl = getFilePathFromUrl;
const stringToBitIndex = (userId) => {
    const hash = crypto_1.default.createHash("md5").update(userId).digest("hex");
    return parseInt(hash.slice(0, 8), 16); // lấy 32-bit integer
};
exports.stringToBitIndex = stringToBitIndex;
const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomNumber = randomNumber;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
