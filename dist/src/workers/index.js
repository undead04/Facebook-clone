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
const init_mongodb_1 = __importDefault(require("../databases/init.mongodb"));
const email_consumer_1 = require("./services/email.consumer");
const multer_1 = __importDefault(require("multer"));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, multer_1.default)().any();
    init_mongodb_1.default;
    console.log("Start worker");
    yield email_consumer_1.emailConsumer.consumerToQueueNormal();
    yield email_consumer_1.emailConsumer.consumerToQueueFailed();
});
start().catch((error) => console.error(`Rabbit MQ : ${error.message}`, error));
