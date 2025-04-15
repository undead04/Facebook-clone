import { connectRabbitMQ } from "../databases/init.rabbitmq";
import { SendEmailOptions } from "../services/email.service";

export const emailPublish = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const { channel } = await connectRabbitMQ();

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
    await channel.assertExchange(retryExchange, "direct", { durable: true });

    await channel.assertQueue(retryQueue, {
      durable: true,
      deadLetterExchange: emailExchange, // quay lại queue chính sau retry
      deadLetterRoutingKey: emailRoutingKey,
      messageTtl: 5000, // chờ 5s rồi quay lại
    });

    await channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);

    // 2. Tạo exchange chính (topic hoặc direct đều được)
    await channel.assertExchange(emailExchange, "direct", { durable: true });

    // 3. Tạo queue chính + cấu hình DLX nếu fail
    await channel.assertQueue(emailQueue, {
      durable: true,
      deadLetterExchange: emailDLXExchange,
      deadLetterRoutingKey: emailDLXRoutingKey,
    });

    await channel.bindQueue(emailQueue, emailExchange, emailRoutingKey);

    // 4. Tạo exchange + queue cho DLX (log lỗi, phân tích, v.v.)
    await channel.assertExchange(emailDLXExchange, "direct", { durable: true });

    await channel.assertQueue(emailDLXQueue, { durable: true });
    await channel.bindQueue(emailDLXQueue, emailDLXExchange, emailDLXRoutingKey);

    // 5. Gửi message đến exchange chính
    const message = { to, subject, html };

    console.log("📤 Sending email to queue...");
    await channel.publish(
      emailExchange,
      emailRoutingKey,
      Buffer.from(JSON.stringify(message)),
      {
        expiration: "10000", // TTL: 10s
        persistent: true,
      }
    );

    setTimeout(() => {
      channel.close();
    }, 500);
  } catch (error) {
    console.error("❌ Error while publishing email:", error);
    throw error;
  }
};
