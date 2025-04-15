"use strict";

import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import postModel from "../../models/post.model";


const postConsumer = {
  consumerToQueueNormal: async () => {

  try {
    const { channel } = await connectRabbitMQ();

    const postQueue = "postQueue";
    const retryExchange = "post-retry-exchange";
    const retryRoutingKey = "post.retry.routing.key";

    await channel.prefetch(1); // xử lý 1 message một lúc cho an toàn

    
    await channel.consume(postQueue, async (msg) => {
      if (!msg) return;
      let content = JSON.parse(msg.content.toString());
      try {
        console.log("📩 Consuming post upload Avatar:", content.imagesName);
        
        await postModel.create({
          userId: content.userId,
          content: content.content,
          imagesName: content.imagesName,
          typePost: content.typePost
        });

        channel.ack(msg); // xác nhận đã xử lý xong
      } catch (err) {
        console.error("❌ Post upload failed, retrying...", err);
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
    console.error("❌ Error in post consumer:", err);
    throw err;
  }
},

  consumerToQueueFailed: async () => {
    try{
      const { channel } = await connectRabbitMQ();
      const postDLXQueue = "postlDLXQueue";
      const postExchangeDLX = "post-exchange-dlx";
      const postDLXRoutingKey = "post-dlx.routing.key";
      // 1. Tạo exchange retry để xử lý retry sau khi thất bại
    await channel.assertExchange(postExchangeDLX, "direct", { durable: true });
    await channel.assertQueue(postDLXQueue, {
      durable: true
    });

    await channel.bindQueue(postDLXQueue, postExchangeDLX, postDLXRoutingKey);
    await channel.consume(postDLXQueue,async (msg) => {
        if (!msg) return;
        console.log('📩 Consuming post DLX:',);
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
export { postConsumer };
