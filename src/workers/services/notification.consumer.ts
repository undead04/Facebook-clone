"use strict";
import notificationModel from "../../models/notification.model";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import { BadRequestError } from "../../middlewares/error.response";
import userModel from "../../models/user.model";
import { NotificationOptions } from "../../messaging/notifcationPublish";
export const notificationConsumer = {
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();
      const notificationQueue = "notificationQueue";

      // Logic: xử lý nghiệp vụ chính
      channel.consume(notificationQueue, async (msg) => {
        if (!msg) return;
        console.log("[TTL] Message notification:", msg.content.toString());
        try {
          if (!msg) return;
          const data: NotificationOptions = JSON.parse(msg.content.toString());

          // TODO: xử lý logic ở đây
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
          channel.nack(msg, false, false); // từ chối xử lý, không requeue
          throw error;
        }
      });
    } catch (error) {
      console.error("Error in consumerToQueueNormal notification: ", error);
      throw error;
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
      console.error("Error in consumerToQueueFailed notification: ", error);
      throw error;
    }
  },
};
