"use strict";
import FirebaseStorageService from "services/firebaseStorave.service";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";

const uploadService = {
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();
      const uploadImageQueue = "upload-image-queue";

      // TTL: xử lý thông báo hết hạn hoặc cần delay
      channel.consume(uploadImageQueue, (msg) => {
        if (msg) {
          console.log("[TTL] Message:", msg.content.toString());
          channel.ack(msg);
        }
      });

      // Logic: xử lý nghiệp vụ chính
      channel.consume(uploadImageQueue, async (msg) => {
        if (!msg) return;
        try {
          const data = JSON.parse(msg.content.toString());
          // TODO: xử lý logic ở đây
          await FirebaseStorageService.uploadLocalFile(data.image, data.type);
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

export default uploadService;
