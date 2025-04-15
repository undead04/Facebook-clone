import { connectRabbitMQ } from "../databases/init.rabbitmq";
export interface INotifiPublishOption {
    senderId: string;
    receiverId: string;
    type: string;
    content: string;
}
export const notifiPublish = async (data: INotifiPublishOption) => {
  try {
    const { channel } = await connectRabbitMQ();

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
    await channel.assertExchange(retryExchange, "direct", { durable: true });

    await channel.assertQueue(retryQueue, {
      durable: true,
      deadLetterExchange: notifiExchange, // quay lại queue chính sau retry
      deadLetterRoutingKey: notifiRoutingKey,
      messageTtl: 5000, // chờ 5s rồi quay lại
    });

    await channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);

    // 2. Tạo exchange chính (topic hoặc direct đều được)
    await channel.assertExchange(notifiExchange, "direct", { durable: true });

    // 3. Tạo queue chính + cấu hình DLX nếu fail
    await channel.assertQueue(notifiQueue, {
      durable: true,
      deadLetterExchange: notifiDLXExchange,
      deadLetterRoutingKey: notifiDLXRoutingKey,
    });

    await channel.bindQueue(notifiQueue, notifiExchange, notifiRoutingKey);

    // 4. Tạo exchange + queue cho DLX (log lỗi, phân tích, v.v.)
    await channel.assertExchange(notifiDLXExchange, "direct", { durable: true });

    await channel.assertQueue(notifiDLXQueue, { durable: true });
    await channel.bindQueue(notifiDLXQueue, notifiDLXExchange, notifiDLXRoutingKey);

    console.log("📤 Sending notifi to queue...");
    await channel.publish(
      notifiExchange,
      notifiRoutingKey,
      Buffer.from(JSON.stringify(data)),
      {
        expiration: "10000", // TTL: 10s
        persistent: true,
      }
    );

    setTimeout(() => {
      channel.close();
    }, 500);
  } catch (error) {
    console.error("❌ Error while publishing notifi:", error);
    throw error;
  }
};
