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
exports.notifiPublish = void 0;
const init_rabbitmq_1 = require("../databases/init.rabbitmq");
const notifiPublish = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
        // Cấu hình tên exchange, queue, routing key
        const notifiExchange = "notifi-exchange";
        const notifiRoutingKey = "notifi.routing.key";
        const notifiQueue = "notifiQueue";
        const notifiDLXExchange = "notifi-DLX-exchange";
        const notifiDLXRoutingKey = "notifi.DLX.routing.key";
        const notifiDLXQueue = "notifiDLXQueue";
        const retryExchange = "notifi-retry-exchange";
        const retryRoutingKey = "notifi.retry.routing.key";
        const retryQueue = "notifiRetryQueue";
        // 1. Tạo exchange retry để xử lý retry sau khi thất bại
        yield channel.assertExchange(retryExchange, "direct", { durable: true });
        yield channel.assertQueue(retryQueue, {
            durable: true,
            deadLetterExchange: notifiExchange, // quay lại queue chính sau retry
            deadLetterRoutingKey: notifiRoutingKey,
            messageTtl: 5000, // chờ 5s rồi quay lại
        });
        yield channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);
        // 2. Tạo exchange chính (topic hoặc direct đều được)
        yield channel.assertExchange(notifiExchange, "direct", { durable: true });
        // 3. Tạo queue chính + cấu hình DLX nếu fail
        yield channel.assertQueue(notifiQueue, {
            durable: true,
            deadLetterExchange: notifiDLXExchange,
            deadLetterRoutingKey: notifiDLXRoutingKey,
        });
        yield channel.bindQueue(notifiQueue, notifiExchange, notifiRoutingKey);
        // 4. Tạo exchange + queue cho DLX (log lỗi, phân tích, v.v.)
        yield channel.assertExchange(notifiDLXExchange, "direct", { durable: true });
        yield channel.assertQueue(notifiDLXQueue, { durable: true });
        yield channel.bindQueue(notifiDLXQueue, notifiDLXExchange, notifiDLXRoutingKey);
        console.log("📤 Sending notifi to queue...");
        yield channel.publish(notifiExchange, notifiRoutingKey, Buffer.from(JSON.stringify(data)), {
            expiration: "10000", // TTL: 10s
            persistent: true,
        });
        setTimeout(() => {
            channel.close();
        }, 500);
    }
    catch (error) {
        console.error("❌ Error while publishing notifi:", error);
        throw error;
    }
});
exports.notifiPublish = notifiPublish;
