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
exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = __importDefault(require("../configs/config"));
const error_response_1 = require("../middlewares/error.response");
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(config_1.default.rabbitMQUrl);
        if (!connection)
            throw new error_response_1.NotFoundError("Not connect");
        const channel = yield connection.createChannel();
        return { channel, connection };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.connectRabbitMQ = connectRabbitMQ;
