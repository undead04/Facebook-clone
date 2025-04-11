import instanceMongodb from "../databases/init.mongodb";
import { emailConsumer } from "./services/email.consumer";
import { notificationConsumer } from "./services/notification.consumer";
import { uploadConsumer } from "./services/upload.consumer";
import { deleteImageConsumer } from "./services/deleteImage.consumer";
import multer from "multer";
const start = async () => {
  await multer().any();
  instanceMongodb;
  console.log("Start worker");
  await emailConsumer.consumerToQueueNormal();
  await emailConsumer.consumerToQueueFailed();

  await uploadConsumer.consumerToQueueNormal();
  await uploadConsumer.consumerToQueueFailed();

  await deleteImageConsumer.consumerToQueueNormal();
  await deleteImageConsumer.consumerToQueueFailed();

  await notificationConsumer.consumerToQueueNormal();
  await notificationConsumer.consumerToQueueFailed();
};
start().catch((error) => console.error(`Rabbit MQ : ${error.message}`, error));
