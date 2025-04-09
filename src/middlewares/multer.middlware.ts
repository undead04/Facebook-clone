// src/middlewares/upload.middleware.ts
import multer from "multer";
import path from "path";

// Cấu hình lưu file tạm thời trên server
const storage = multer.memoryStorage(); // Dùng memory nếu muốn uploadBuffer

// Nếu muốn lưu file vào ổ đĩa thì dùng diskStorage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

const upload = multer({ storage });

export default upload;
