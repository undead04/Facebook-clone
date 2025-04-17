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
exports.postConsumer = void 0;
const init_rabbitmq_1 = require("../../databases/init.rabbitmq");
const post_model_1 = __importDefault(require("../../models/post.model"));
const postConsumer = {
    consumerToQueueNormal: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
            const postQueue = "postQueue";
            const retryExchange = "post-retry-exchange";
            const retryRoutingKey = "post.retry.routing.key";
            yield channel.prefetch(1); // xử lý 1 message một lúc cho an toàn
            yield channel.consume(postQueue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
                if (!msg)
                    return;
                let content = JSON.parse(msg.content.toString());
                try {
                    console.log("📩 Consuming post upload Avatar:", content.imagesName);
                    yield post_model_1.default.create({
                        userId: content.userId,
                        content: content.content,
                        imagesName: content.imagesName,
                        typePost: content.typePost
                    });
                    channel.ack(msg); // xác nhận đã xử lý xong
                }
                catch (err) {
                    console.error("❌ Post upload failed, retrying...", err);
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
            console.error("❌ Error in post consumer:", err);
            throw err;
        }
    }),
    consumerToQueueFailed: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
            const postDLXQueue = "postlDLXQueue";
            const postExchangeDLX = "post-exchange-dlx";
            const postDLXRoutingKey = "post-dlx.routing.key";
            // 1. Tạo exchange retry để xử lý retry sau khi thất bại
            yield channel.assertExchange(postExchangeDLX, "direct", { durable: true });
            yield channel.assertQueue(postDLXQueue, {
                durable: true
            });
            yield channel.bindQueue(postDLXQueue, postExchangeDLX, postDLXRoutingKey);
            yield channel.consume(postDLXQueue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
                if (!msg)
                    return;
                console.log('📩 Consuming post DLX:');
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
exports.postConsumer = postConsumer;
