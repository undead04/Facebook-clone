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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPublish = void 0;
const init_rabbitmq_1 = require("../databases/init.rabbitmq");
const postPublish = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
        const postQueue = "postQueue";
        const retryQueue = "emailRetryQueue";
        const postExchange = "post-exchange";
        const postRoutingKey = "email.routing.key";
        const postExchangeDLX = "post-exchange-dlx";
        const postDLXRoutingKey = "post-dlx.routing.key";
        const retryExchange = "post-retry-exchange";
        const retryRoutingKey = "post.retry.routing.key";
        // 1. Tạo exchange retry để xử lý retry sau khi thất bại
        yield channel.assertExchange(retryExchange, "direct", { durable: true });
        yield channel.assertQueue(retryQueue, {
            durable: true,
            deadLetterExchange: postExchange, // quay lại queue chính sau retry
            deadLetterRoutingKey: postRoutingKey,
            messageTtl: 5000, // chờ 5s rồi quay lại
        });
        yield channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);
        // 1. Tạo exchange chính và DLX
        yield channel.assertExchange(postExchange, "direct", { durable: true });
        yield channel.assertExchange(postExchangeDLX, "direct", { durable: true });
        // 2. Tạo queue chính và cấu hình TTL + DLX
        yield channel.assertQueue(postQueue, {
            durable: true,
            exclusive: true,
            deadLetterExchange: postExchangeDLX,
            deadLetterRoutingKey: postDLXRoutingKey,
            messageTtl: 10000, // TTL tại đây hoặc set lúc send
        });
        // 4. Bind queue chính vào exchange chính
        yield channel.bindQueue(postQueue, postExchange, postRoutingKey);
        // 6. Gửi message vào exchange (not sendToQueue)
        yield channel.publish(postExchange, postRoutingKey, Buffer.from(JSON.stringify(data)), {
            persistent: true,
            expiration: "10000", // Optional TTL tại message (nếu không set ở queue)
        });
        console.log("📤 Gửi upload event thành công");
        setTimeout(() => {
            channel.close();
        }, 500);
    }
    catch (error) {
        console.error("❌ Producer upload error:", error);
        throw error;
    }
});
exports.postPublish = postPublish;
