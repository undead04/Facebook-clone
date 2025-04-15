"use strict";

import notificationModel from "../../models/notification.model";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";


const notifiConsumer = {
  consumerToQueueNormal: async () => {

  try {
    const { channel } = await connectRabbitMQ();

    const notifiQueue = "notifiQueue";
    const retryExchange = "notifi-retry-exchange";
    const retryRoutingKey = "notifi.retry.routing.key";

    await channel.prefetch(1); // xử lý 1 message một lúc cho an toàn
    
    await channel.consume(notifiQueue, async (msg) => {
      if (!msg) return;
      let content = JSON.parse(msg.content.toString());
      try {
        console.log("📩 Consuming notifi:", content.content);
        await notificationModel.create({
          senderId: content.senderId,
          receiverId: content.receiverId,
          type: content.type,
          content: content.content
        })

        channel.ack(msg); // xác nhận đã xử lý xong
      } catch (err) {
        console.error("❌ Notifi send failed, retrying...", err);
        content.retryCount = (content.retryCount || 0) + 1;
        if (content.retryCount > 3) {
          // Gửi về queue lỗi (DLX)
          channel.nack(msg,false,false);
        } else {
          // Retry
          channel.publish(
            retryExchange,
            retryRoutingKey,
            Buffer.from(JSON.stringify(content)),
            { persistent: true }
          );
          channel.ack(msg);
        }
      }
    }), {
      noAck: false
    };
  } catch (err) {
    console.error("❌ Error in notifi consumer:", err);
    throw err;
  }
},

  consumerToQueueFailed: async () => {
    try{
      const { channel } = await connectRabbitMQ();
      const notifiDLXQueue = "notifiDLXQueue";

      await channel.consume(notifiDLXQueue,async (msg) => {
        if (!msg) return;
        console.log('📩 Consuming notifi DLX:',);
        channel.ack(msg)
      },{
        noAck:false
      })
    }catch(error){
      console.warn(error)
      throw error
    }
  }  
};
export { notifiConsumer };
