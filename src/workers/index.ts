import instanceMongodb from "../databases/init.mongodb";
import { emailConsumer } from "./services/email.consumer";
import multer from "multer";
import { postConsumer } from "./services/post.consumer";
import { notifiConsumer } from "./services/notifi.consumer";
const start = async () => {
  await multer().any();
  instanceMongodb;
  console.log("Start worker");
  await emailConsumer.consumerToQueueNormal();
  await emailConsumer.consumerToQueueFailed();

  await postConsumer.consumerToQueueNormal();
  await postConsumer.consumerToQueueFailed();

  await notifiConsumer.consumerToQueueNormal();
  await notifiConsumer.consumerToQueueFailed();
};
start().catch((error) => console.error(`Rabbit MQ : ${error.message}`, error));
