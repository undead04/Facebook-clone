"use strict";
import notificationModel from "../../models/notification.model";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import { NotificationOptions } from "../../messaging/notifcationPublish";

export const notificationConsumer = {
  consumerToQueueNormal: async () => {
    const notificationQueue = "notificationQueue";
    const notificationExchangeDLX = "notification-exDLX";
    const notificationRoutingkeyDLX = "notification-routingkey-DLX";
    try {
      const { channel } = await connectRabbitMQ();

      try {
        // Sử dụng assertQueue với passive: true để kiểm tra queue tồn tại
        // Nếu queue không tồn tại, nó sẽ throw error nhưng không tạo queue mới
        // 2. Create queue with DLX support
        await channel.assertQueue(notificationQueue, {
          durable: true,
          exclusive: false,
          deadLetterExchange: notificationExchangeDLX,
          deadLetterRoutingKey: notificationRoutingkeyDLX,
        });

        // Nếu queue tồn tại, thiết lập consumer
        await channel.consume(
          notificationQueue,
          async (msg) => {
            if (!msg) return;

            try {
              const data: NotificationOptions = JSON.parse(
                msg.content.toString()
              );
              const { senderId, receiverId, type, content } = data;

              await notificationModel.create({
                senderId,
                receiverId,
                type,
                content,
              });

              console.log("Notification created successfully");
              channel.ack(msg);
            } catch (error) {
              console.error("Error in message logic:", error);
              channel.nack(msg, false, false);
            }
          },
          { noAck: false }
        );

        console.log(`Consumer started for queue: ${notificationQueue}`);
      } catch (error: any) {
        if (error.code === 404) {
          console.warn(
            `Queue "${notificationQueue}" does not exist. Skipping consumer.`
          );
          return;
        }
        console.warn("Error checking queue:", error);
        return; // Không throw error nữa, chỉ return
      }
    } catch (error) {
      console.warn("Error in consumerToQueueNormal notification:", error);
      return; // Không throw error nữa, chỉ return
    }
  },

  consumerToQueueFailed: async () => {
    try {
      const { channel } = await connectRabbitMQ();

      const notificationExchangeDLX = "notification-exDLX";
      const notificationRoutingkeyDLX = "notification-routingkey-DLX";
      const notificationQueueHandler = "notificationQueueHandler";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingkeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg) {
            console.log(
              "[FAILED] Message notification:",
              msg.content.toString()
            );
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.warn("Error in consumerToQueueFailed notification:", error);
      return; // Không throw error nữa, chỉ return
    }
  },
};
