"use strict";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import { UploadImageOptions } from "../../messaging/uploadImagePublish";
import { UploadStrategyFactory } from "../../services/upload/UploadStrategyFactory";
import { UploadType } from "../../services/upload/interface/IUploadStrategy";
const uploadConsumer = {
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();
      const uploadImageQueue = "upload-image-queue";

      channel.consume(uploadImageQueue, async (msg) => {
        if (!msg) return;

        try {
          if (!msg) return;
          const data: UploadImageOptions = JSON.parse(msg.content.toString());

          // check type
          if (!Object.values(UploadType).includes(data.type)) {
            throw new Error("Invalid upload type");
          }

          const uploadStrategy = UploadStrategyFactory.create(data.type);
          const result = await uploadStrategy.upload(data.files, data.id);

          console.log("[SUCCESS] Message upload image:", result);
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
            console.log("[FAILED] Message upload image:");
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
export { uploadConsumer };
