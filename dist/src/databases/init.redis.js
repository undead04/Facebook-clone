"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("../configs/config"));
const redisClient = new ioredis_1.default({
    host: config_1.default.redisHost,
    port: config_1.default.redisPort,
    password: config_1.default.redisPassword,
});
redisClient.ping(function (err, result) {
    console.log(result);
});
redisClient.on("connect", () => {
    console.log("Redis connected");
});
redisClient.on("error", (err) => {
    console.error("Redis error: ", err);
});
exports.default = redisClient;
