"use strict";
import amqp from "amqplib";
import { connectRabbitMQ } from "databases/init.rabbitmq";
import { SendEmailOptions } from "services/email.service";

const emailPublish = async (data: SendEmailOptions) => {
  try {
    const { channel } = await connectRabbitMQ();

    const emailExchange = "email-exchange";
    const emailQueue = "emailQueue";
    const emailExchangeDLX = "email-exDLX";
    const emailRoutingkeyDLX = "email-routingkey-DLX";
    // 1. Assert exchange
    await channel.assertExchange(emailExchange, "direct", {
      durable: true,
    });

    // 2. Create queue with DLX support
    const queueResult = await channel.assertQueue(emailQueue, {
      durable: true,
      exclusive: false,
      deadLetterExchange: emailExchangeDLX,
      deadLetterRoutingKey: emailRoutingkeyDLX,
    });

    // 3. Bind queue to exchange
    await channel.bindQueue(queueResult.queue, emailExchange, emailExchangeDLX);

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
export default emailPublish;
