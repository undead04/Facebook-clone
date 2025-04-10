"use strict";
import { connectRabbitMQ } from "../../databases/init.rabbitmq";
import FirebaseStorageService from "../../services/firebaseStorave.service";
import userModel from "../../models/user.model";
import { UploadImageOptions } from "../../messaging/uploadImagePublish";
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

          await uploadConsumer.uploadImage(
            data.userId,
            data.fileName,
            data.image,
            data.folder
          );
          console.log("[SUCCESS] Message upload image:", data);
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
  uploadImage: async (
    userId: string,
    fileName: string,
    image: Buffer,
    folder: string
  ) => {
    const user = await userModel.findById(userId);
    if (!user) return;
    let filePath = "";
    switch (folder) {
      case "avatar":
        filePath = user.profile.avatarName;
        break;
      case "coverPhoto":
        filePath = user.profile.coverPhotoName;
        break;
    }
    if (filePath) {
      if (await FirebaseStorageService.fileExists(filePath)) {
        const result = await FirebaseStorageService.deleteFile(filePath);
        console.log("[DELETE] Result delete file:", result);
      }
    }
    // Xử lý logic upload image
    const buffer = Buffer.from(image);

    const { url, filePath: newFilePath } =
      await FirebaseStorageService.uploadBuffer(buffer, fileName, folder);

    switch (folder) {
      case "avatar":
        user.profile.avatarUrl = url;
        user.profile.avatarName = newFilePath;
        break;
      case "coverPhoto":
        user.profile.coverPhotoUrl = url;
        user.profile.coverPhotoName = newFilePath;
        break;
    }
    await user.save();
  },
};
export { uploadConsumer };
