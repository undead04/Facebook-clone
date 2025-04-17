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
exports.emailPublish = void 0;
const init_rabbitmq_1 = require("../databases/init.rabbitmq");
const emailPublish = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html }) {
    try {
        const { channel } = yield (0, init_rabbitmq_1.connectRabbitMQ)();
        // Cấu hình tên exchange, queue, routing key
        const emailExchange = "email-exchange";
        const emailRoutingKey = "email.routing.key";
        const emailQueue = "emailQueue";
        const emailDLXExchange = "email-DLX-exchange";
        const emailDLXRoutingKey = "email.DLX.routing.key";
        const emailDLXQueue = "emailDLXQueue";
        const retryExchange = "email-retry-exchange";
        const retryRoutingKey = "email.retry.routing.key";
        const retryQueue = "emailRetryQueue";
        // 1. Tạo exchange retry để xử lý retry sau khi thất bại
        yield channel.assertExchange(retryExchange, "direct", { durable: true });
        yield channel.assertQueue(retryQueue, {
            durable: true,
            deadLetterExchange: emailExchange, // quay lại queue chính sau retry
            deadLetterRoutingKey: emailRoutingKey,
            messageTtl: 5000, // chờ 5s rồi quay lại
        });
        yield channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);
        // 2. Tạo exchange chính (topic hoặc direct đều được)
        yield channel.assertExchange(emailExchange, "direct", { durable: true });
        // 3. Tạo queue chính + cấu hình DLX nếu fail
        yield channel.assertQueue(emailQueue, {
            durable: true,
            deadLetterExchange: emailDLXExchange,
            deadLetterRoutingKey: emailDLXRoutingKey,
        });
        yield channel.bindQueue(emailQueue, emailExchange, emailRoutingKey);
        // 4. Tạo exchange + queue cho DLX (log lỗi, phân tích, v.v.)
        yield channel.assertExchange(emailDLXExchange, "direct", { durable: true });
        yield channel.assertQueue(emailDLXQueue, { durable: true });
        yield channel.bindQueue(emailDLXQueue, emailDLXExchange, emailDLXRoutingKey);
        // 5. Gửi message đến exchange chính
        const message = { to, subject, html };
        console.log("📤 Sending email to queue...");
        yield channel.publish(emailExchange, emailRoutingKey, Buffer.from(JSON.stringify(message)), {
            expiration: "10000", // TTL: 10s
            persistent: true,
        });
        setTimeout(() => {
            channel.close();
        }, 500);
    }
    catch (error) {
        console.error("❌ Error while publishing email:", error);
        throw error;
    }
});
exports.emailPublish = emailPublish;
