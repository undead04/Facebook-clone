import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import config from "../configs/config";
import { getFilePathFromUrl } from "../utils";
// Đường dẫn tới file key JSON của Firebase
const serviceAccount =
  require("../configs/firebase-key.json") as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: config.firebaseStorageBucket, // ví dụ: facebook-clone.appspot.com
});

const bucket = getStorage().bucket();

class FirebaseStorageService {
  static async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    folder = "uploads"
  ) {
    const filePath = `${folder}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType: "image/jpeg", // hoặc 'image/png', 'application/pdf' tùy loại file
      },
    });
    await file.makePublic(); // Nếu muốn public file
    return { url: file.publicUrl(), filePath };
  }

  static async uploadLocalFile(filePath: string, destination: string) {
    const options = {
      destination,
      public: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    };

    const [file] = await bucket.upload(filePath, options);
    return file.publicUrl();
  }

  static async deleteFile(filePath: string) {
    const file = bucket.file(filePath);
    console.log("[DELETE] File:", filePath);
    return await file.delete();
  }
  static async fileExists(filePath: string): Promise<boolean> {
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    return exists;
  }
}

export default FirebaseStorageService;
