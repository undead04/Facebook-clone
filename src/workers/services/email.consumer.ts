"use strict";
import { sendEmail } from "../../services/email.service";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";

const emailConsumer = {
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();
      const emailQueue = "emailQueue";

      channel.consume(emailQueue, async (msg) => {
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
      console.error("Error in consumerToQueueNormal:", error);
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
    } catch (error) {
      console.error("Error in consumerToQueueFailed:", error);
      throw error;
    }
  },
};
export { emailConsumer };
