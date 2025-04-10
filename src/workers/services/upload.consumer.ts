"use strict";
import FirebaseStorageService from "../../services/firebaseStorave.service";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import { UploadImageOptions } from "../../messaging/uploadImagePublish";

const uploadConsumer = {
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();
      const uploadImageQueue = "upload-image-queue";

      // TTL: xử lý thông báo hết hạn hoặc cần delay
      channel.consume(uploadImageQueue, (msg) => {
        if (msg) {
          console.log("[TTL] Message upload image:", msg.content.toString());
          channel.ack(msg);
        }
      });

      // Logic: xử lý nghiệp vụ chính
      channel.consume(uploadImageQueue, async (msg) => {
        if (!msg) return;
        try {
          const data: UploadImageOptions = JSON.parse(msg.content.toString());
          // TODO: xử lý logic ở đây
          await FirebaseStorageService.uploadBuffer(
            data.image,
            data.fileName,
            data.folder
          );

          console.log("Upload image successfully");
          channel.ack(msg);
        } catch (error) {
          console.error("Error in message logic upload image:", error);
          channel.nack(msg, false, false); // từ chối xử lý, không requeue
        }
      });
    } catch (error) {
      console.error("Error in consumerToQueueNormal upload image:", error);
    }
  },

  consumerToQueueFailed: async () => {
    try {
      const { channel } = await connectRabbitMQ();

      const uploadImageExchangeDLX = "upload-image-exDLX";
      const uploadImageRoutingkeyDLX = "upload-image-routingkey-DLX";
      const uploadImageQueueHandler = "upload-image-queue-handler";

      await channel.assertExchange(uploadImageExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(uploadImageQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        uploadImageExchangeDLX,
        uploadImageRoutingkeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg) {
            console.log(
              "[FAILED] Message upload image:",
              msg.content.toString()
            );
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("Error in consumerToQueueFailed upload image:", error);
      throw error;
    }
  },
};

export { uploadConsumer };
