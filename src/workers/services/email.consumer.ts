"use strict";

import { sendEmail } from "../../services/email.service";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";


const emailConsumer = {
  consumerToQueueNormal: async () => {

  try {
    const { channel } = await connectRabbitMQ();

    const emailQueue = "emailQueue";
    const retryExchange = "email-retry-exchange";
    const retryRoutingKey = "email.retry.routing.key";

    await channel.prefetch(1); // xử lý 1 message một lúc cho an toàn
    
    await channel.consume(emailQueue, async (msg) => {
      if (!msg) return;
      let content = JSON.parse(msg.content.toString());
      try {
        console.log("📩 Consuming email:", content.to);
        await sendEmail(content);

        channel.ack(msg); // xác nhận đã xử lý xong
      } catch (err) {
        console.error("❌ Email send failed, retrying...", err);
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
    console.error("❌ Error in email consumer:", err);
    throw err;
  }
},

  consumerToQueueFailed: async () => {
    try{
      const { channel } = await connectRabbitMQ();
      const emailDLXQueue = "emailDLXQueue";

      await channel.consume(emailDLXQueue,async (msg) => {
        if (!msg) return;
        console.log('📩 Consuming email DLX:',);
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
export { emailConsumer };
