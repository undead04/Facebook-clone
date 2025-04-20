import { connectRabbitMQ } from "../databases/init.rabbitmq";
export interface IPostPublishOption {
  userId: string;
  content: string;
  imagesName: string;
  typePost: string;
}
export const postPublish = async (data: IPostPublishOption) => {
  try {
    const { channel } = await connectRabbitMQ();
    const postQueue = "postQueue";
    const postExchange = "post-exchange";
    const postRoutingKey = "post.routing.key";

    const postExchangeDLX = "post-exchange-dlx";
    const postDLXRoutingKey = "post-dlx.routing.key";

    const retryQueue = "postRetryQueue";
    const retryExchange = "post-retry-exchange";
    const retryRoutingKey = "post.retry.routing.key";

    // 1. Tạo exchange retry để xử lý retry sau khi thất bại
    await channel.assertExchange(retryExchange, "direct", { durable: true });
    await channel.assertQueue(retryQueue, {
      durable: true,
      deadLetterExchange: postExchange, // quay lại queue chính sau retry
      deadLetterRoutingKey: postRoutingKey,
      messageTtl: 5000, // chờ 5s rồi quay lại
    });

    await channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);
    // 1. Tạo exchange chính và DLX
    await channel.assertExchange(postExchange, "direct", { durable: true });
    await channel.assertExchange(postExchangeDLX, "direct", { durable: true });

    // 2. Tạo queue chính và cấu hình TTL + DLX
    await channel.assertQueue(postQueue, {
      durable: true,
      deadLetterExchange: postExchangeDLX,
      deadLetterRoutingKey: postDLXRoutingKey,
    });

    // 4. Bind queue chính vào exchange chính
    await channel.bindQueue(postQueue, postExchange, postRoutingKey);

    // 6. Gửi message vào exchange (not sendToQueue)
    await channel.publish(
      postExchange,
      postRoutingKey,
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
        expiration: "10000", // Optional TTL tại message (nếu không set ở queue)
      }
    );

    console.log("📤 Gửi upload event thành công");

    setTimeout(() => {
      channel.close();
    }, 500);
  } catch (error) {
    console.error("❌ Producer upload error:", error);
    throw error;
  }
};
