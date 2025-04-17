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
exports.notifiConsumer = void 0;
const notification_model_1 = __importDefault(require("../../models/notification.model"));
const init_rabbitmq_1 = require("../../databases/init.rabbitmq");
const notifiConsumer = {
    consumerToQueueNormal: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
            const notifiQueue = "notifiQueue";
            const retryExchange = "notifi-retry-exchange";
            const retryRoutingKey = "notifi.retry.routing.key";
            yield channel.prefetch(1); // xử lý 1 message một lúc cho an toàn
            yield channel.consume(notifiQueue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
                if (!msg)
                    return;
                let content = JSON.parse(msg.content.toString());
                try {
                    console.log("📩 Consuming notifi:", content.content);
                    yield notification_model_1.default.create({
                        senderId: content.senderId,
                        receiverId: content.receiverId,
                        type: content.type,
                        content: content.content
                    });
                    channel.ack(msg); // xác nhận đã xử lý xong
                }
                catch (err) {
                    console.error("❌ Notifi send failed, retrying...", err);
                    content.retryCount = (content.retryCount || 0) + 1;
                    if (content.retryCount > 3) {
                        // Gửi về queue lỗi (DLX)
                        channel.nack(msg, false, false);
                    }
                    else {
                        // Retry
                        channel.publish(retryExchange, retryRoutingKey, Buffer.from(JSON.stringify(content)), { persistent: true });
                        channel.ack(msg);
                    }
                }
            })), {
                noAck: false
            };
        }
        catch (err) {
            console.error("❌ Error in notifi consumer:", err);
            throw err;
        }
    }),
    consumerToQueueFailed: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
            const notifiDLXQueue = "notifiDLXQueue";
            yield channel.consume(notifiDLXQueue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
                if (!msg)
                    return;
                console.log('📩 Consuming notifi DLX:');
                channel.ack(msg);
            }), {
                noAck: false
            });
        }
        catch (error) {
            console.warn(error);
            throw error;
        }
    })
};
exports.notifiConsumer = notifiConsumer;
