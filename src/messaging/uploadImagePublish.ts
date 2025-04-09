"use strict";

import { connectRabbitMQ } from "databases/init.rabbitmq";
import { SendEmailOptions } from "services/email.service";

interface UploadImageOptions {
  type: "avatar" | "coverPhoto";
  image: Express.Multer.File;
}
const uploadImagePublish = async (data: UploadImageOptions) => {
  try {
    const { channel } = await connectRabbitMQ();

    const uploadImageExchange = "upload-image-exchange";
    const uploadImageQueue = "upload-image-queue";
    const uploadImageExchangeDLX = "upload-image-exDLX";
    const uploadImageRoutingkeyDLX = "upload-image-routingkey-DLX";
    // 1. Assert exchange
    await channel.assertExchange(uploadImageExchange, "direct", {
      durable: true,
    });

    // 2. Create queue with DLX support
    const queueResult = await channel.assertQueue(uploadImageQueue, {
      durable: true,
      exclusive: false,
      deadLetterExchange: uploadImageExchangeDLX,
      deadLetterRoutingKey: uploadImageRoutingkeyDLX,
    });

    // 3. Bind queue to exchange
    await channel.bindQueue(
      queueResult.queue,
      uploadImageExchange,
      uploadImageRoutingkeyDLX
    );

    // 4. Send message
    console.log("Publishing:", data);

    await channel.sendToQueue(
      queueResult.queue,
      Buffer.from(JSON.stringify(data)),
      {
        expiration: "10000", // TTL in ms (10s)
      }
    );

    setTimeout(() => {
      channel.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Producer error:", error);
    throw error;
  }
};
export default uploadImagePublish;
