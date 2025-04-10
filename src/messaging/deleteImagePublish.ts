"use strict";
import { connectRabbitMQ } from "../databases/init.rabbitmq";

export interface deleteImageOtions {
  filePath: string;
}

const deleteImagePublish = async (data: deleteImageOtions) => {
  try {
    const { channel } = await connectRabbitMQ();
    console.log("data", data);
    const deleteImageExchange = "deleteImage-exchange";
    const deleteImageQueue = "deleteImageQueue";
    const deleteImageExchangeDLX = "deleteImage-exDLX";
    const deleteImageRoutingkeyDLX = "deleteImage-routingkey-DLX";
    // 1. Assert exchange
    await channel.assertExchange(deleteImageExchange, "direct", {
      durable: true,
    });

    // 2. Create queue with DLX support
    const queueResult = await channel.assertQueue(deleteImageQueue, {
      durable: true,
      exclusive: false,
      deadLetterExchange: deleteImageExchangeDLX,
      deadLetterRoutingKey: deleteImageRoutingkeyDLX,
    });

    // 3. Bind queue to exchange
    await channel.bindQueue(
      queueResult.queue,
      deleteImageExchange,
      deleteImageRoutingkeyDLX
    );

    // 4. Send message
    console.log("Publishing delete image to queue:", data);

    await channel.sendToQueue(
      queueResult.queue,
      Buffer.from(JSON.stringify(data)),
      {
        expiration: "10000", // TTL in ms (10s)
      }
    );

    setTimeout(() => {
      channel.close();
    }, 500);
  } catch (error) {
    console.error("Producer email error:", error);
    throw error;
  }
};
export default deleteImagePublish;
