"use strict";
import amqp from "amqplib";
import config from "../configs/config";
import { NotFoundError } from "../middlewares/error.response";
const connectRabbitMQ = async (): Promise<{
  channel: amqp.Channel;
  connection: amqp.ChannelModel;
}> => {
  try {
    const connection = await amqp.connect(config.rabbitMQUrl);
    if (!connection) throw new NotFoundError("Not connect");
    const channel = await connection.createChannel();
    return { channel, connection };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { connectRabbitMQ };
