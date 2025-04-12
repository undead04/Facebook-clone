"use strict";
import { sendEmail } from "../../services/email.service";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";

const emailConsumer = {
  consumerToQueueNormal: async () => {
    const emailQueue = "emailQueue";
    const emailExchangeDLX = "email-exDLX";
    const emailRoutingkeyDLX = "email-routingkey-DLX";

    try {
      const { channel } = await connectRabbitMQ();

      // 2. Create queue with DLX support
      await channel.assertQueue(emailQueue, {
        durable: true,
        exclusive: false,
        deadLetterExchange: emailExchangeDLX,
        deadLetterRoutingKey: emailRoutingkeyDLX,
      });

      await channel.consume(emailQueue, async (msg) => {
        if (!msg) return;

        try {
          const data = JSON.parse(msg.content.toString());

          // Kiểm tra TTL hoặc delay nếu có
          if (
            msg.properties.expiration ||
            msg.properties.headers?.["x-delay"]
          ) {
            console.log("[TTL] Message email delay/expired:", data);
          }

          // Xử lý logic gửi email
          const result = await sendEmail(data);
          console.log("result", result);

          channel.ack(msg);
        } catch (error) {
          console.error("Error in message logic:", error);
          channel.nack(msg, false, false); // từ chối xử lý, không requeue
        }
      });
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === 404) {
        console.warn(
          `[!] Queue "${emailQueue}" does not exist. Skipping consumer.`
        );
      } else {
        console.error("Error checking queue:", error);
      }
    }
  },
  consumerToQueueFailed: async () => {
    try {
      const { channel } = await connectRabbitMQ();

      const emailExchangeDLX = "email-exDLX";
      const emailRoutingkeyDLX = "email-routingkey-DLX";
      const emailQueueHandler = "emailQueueHandler";

      await channel.assertExchange(emailExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(emailQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        emailExchangeDLX,
        emailRoutingkeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg) {
            console.log("[FAILED] Message:", msg.content.toString());
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
      console.log(`Consumer started for queue: ${emailQueueHandler}`);
    } catch (error) {
      console.error("Error in consumerToQueueFailed:", error);
      throw error;
    }
  },
};
export { emailConsumer };
