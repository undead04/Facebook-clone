import { emailConsumer } from "./services/email.consumer";
import { notificationConsumer } from "./services/notification.consumer";
import { uploadConsumer } from "./services/upload.consumer";
const start = async () => {
  console.log("Start worker");
  await emailConsumer.consumerToQueueNormal();
  await emailConsumer.consumerToQueueFailed();
};
start().catch((error) => console.error(`Rabbit MQ : ${error.message}`, error));
