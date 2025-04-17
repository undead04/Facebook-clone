"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("./config"));
exports.transporter = nodemailer_1.default.createTransport({
    host: config_1.default.emailHost,
    port: config_1.default.emailPort,
    secure: config_1.default.emailSecure, // true nếu port 465
    auth: {
        user: config_1.default.emailUser,
        pass: config_1.default.emailPassword,
    },
});
