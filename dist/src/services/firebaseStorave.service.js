"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
const config_1 = __importDefault(require("../configs/config"));
// Đường dẫn tới file key JSON của Firebase
const serviceAccount = require("../configs/firebase-key.json");
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
    storageBucket: config_1.default.firebaseStorageBucket, // ví dụ: facebook-clone.appspot.com
});
const bucket = (0, storage_1.getStorage)().bucket();
class FirebaseStorageService {
    static uploadBuffer(buffer_1, fileName_1) {
        return __awaiter(this, arguments, void 0, function* (buffer, fileName, folder = "uploads") {
            const filePath = `${folder}/${Date.now()}-${fileName}`;
            const file = bucket.file(filePath);
            yield file.save(buffer, {
                metadata: {
                    contentType: "image/jpeg", // hoặc 'image/png', 'application/pdf' tùy loại file
                },
            });
            yield file.makePublic(); // Nếu muốn public file
            return { url: file.publicUrl(), filePath };
        });
    }
    static uploadLocalFile(filePath, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                destination,
                public: true,
                metadata: {
                    cacheControl: "public, max-age=31536000",
                },
            };
            const [file] = yield bucket.upload(filePath, options);
            return file.publicUrl();
        });
    }
    static deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = bucket.file(filePath);
            console.log("[DELETE] File:", filePath);
            return yield file.delete();
        });
    }
    static fileExists(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = bucket.file(filePath);
            const [exists] = yield file.exists();
            return exists;
        });
    }
}
exports.default = FirebaseStorageService;
