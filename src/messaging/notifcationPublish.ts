"use strict";

import { connectRabbitMQ } from "../databases/init.rabbitmq";

export interface NotificationOptions {
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
}
const notificationPublish = async (data: NotificationOptions) => {
  try {
    const { channel } = await connectRabbitMQ();

    const notificationExchange = "notification-exchange";
    const notificationQueue = "notificationQueue";
    const notificationExchangeDLX = "notification-exDLX";
    const notificationRoutingkeyDLX = "notification-routingkey-DLX";
    // 1. Assert exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. Create queue with DLX support
    const queueResult = await channel.assertQueue(notificationQueue, {
      durable: true,
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingkeyDLX,
    });

    // 3. Bind queue to exchange
    await channel.bindQueue(
      queueResult.queue,
      notificationExchange,
      notificationRoutingkeyDLX
    );

    // 4. Send message
    console.log("Publishing notification to queue:", data);

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
    console.error("Producer notification error:", error);
    throw error;
  }
};
export default notificationPublish;
