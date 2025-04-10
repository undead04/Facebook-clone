"use strict";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import FirebaseStorageService from "../../services/firebaseStorave.service";

import { deleteImageOtions } from "../../messaging/deleteImagePublish";
const deleteImageConsumer = {
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();
      const deleteImageQueue = "deleteImageQueue";

      channel.consume(deleteImageQueue, async (msg) => {
        if (!msg) return;

        try {
          if (!msg) return;
          const data: deleteImageOtions = JSON.parse(msg.content.toString());
          const { filePath } = data;
          if (filePath) {
            if (await FirebaseStorageService.fileExists(filePath)) {
              const result = await FirebaseStorageService.deleteFile(filePath);
              console.log(
                "[DELETE] Result delete file:",
                (result as any).statusCode
              );
            }
          }
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

      const deleteImageExchangeDLX = "deleteImage-exDLX";
      const deleteImageRoutingkeyDLX = "deleteImage-routingkey-DLX";
      const deleteImageQueueHandler = "deleteImageQueueHandler";

      await channel.assertExchange(deleteImageExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(deleteImageQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        deleteImageExchangeDLX,
        deleteImageRoutingkeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg) {
            console.log("[FAILED] Message delete image:");
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
export { deleteImageConsumer };
