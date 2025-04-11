# 📘 Facebook Clone

Một dự án **Facebook Clone** được xây dựng với các công nghệ hiện đại như WebSocket, JWT, MongoDB, Redis, RabbitMQ, và Firebase nhằm tái hiện các tính năng mạng xã hội như chat thời gian thực, đăng nhập bảo mật, thông báo email, upload file, like bài viết...

## 🛠️ Công nghệ sử dụng

| Công nghệ     | Mô tả |
|--------------|------|
| **WebSocket (Socket.IO)** | Cung cấp chức năng chat thời gian thực giữa các người dùng. |
| **JWT (JSON Web Token)** | Dùng để xác thực người dùng và phân quyền đăng nhập. |
| **MongoDB** | Lưu trữ dữ liệu người dùng, bài viết, bình luận,... |
| **RabbitMQ** | Hàng đợi xử lý các tác vụ bất đồng bộ như gửi email, upload file,... |
| **Redis** | - Lưu trữ OTP khi đăng ký/đặt lại mật khẩu.<br> - Dùng bitmap để xử lý chức năng like bài viết một cách hiệu quả. |
| **Firebase Storage** | Dùng để upload và lưu trữ các tệp như ảnh đại diện, ảnh bài viết,... |

## ⚙️ Các chức năng chính

### 🔐 Xác thực & Ủy quyền
- Đăng ký và đăng nhập bằng JWT.
- OTP xác thực khi đăng ký hoặc khôi phục mật khẩu (lưu OTP trong Redis).
- Middleware kiểm tra token cho các API bảo vệ.

### 💬 Chat thời gian thực
- Sử dụng WebSocket để kết nối và nhắn tin trực tiếp giữa các người dùng.
- Hỗ trợ hiển thị online/offline.

### 📬 Gửi Email
- Khi có sự kiện quan trọng như: xác nhận email, upload tệp,... sẽ gửi email thông báo bằng RabbitMQ để xử lý không đồng bộ.
- Email có thể gửi qua SMTP

### 🖼️ Upload File
- File sẽ được upload lên Firebase Storage.
- Kết hợp với RabbitMQ để xử lý file sau khi upload (ví dụ: nén ảnh, resize, log, gửi thông báo,...).

### ❤️ Like bài viết
- Sử dụng **Redis bitmap** để lưu trạng thái like một cách tối ưu về bộ nhớ và hiệu năng.
- Có thể dễ dàng kiểm tra người dùng đã like hay chưa.

### 🗨️ Bình luận (Comment)
- Sử dụng **thuật toán Neat Comment** để xử lý:
  - Gom nhóm bình luận theo mạch hội thoại (threaded).
  - Ưu tiên hiển thị các bình luận có tương tác cao hoặc liên quan nhất.
  - Hỗ trợ comment lồng nhau, rút gọn thông minh khi danh sách dài.
- Lưu trữ dạng cây trong MongoDB, tối ưu cho truy vấn và hiển thị.

### 🔔 Thông báo (Notification)
- Người dùng nhận thông báo khi có:
  - Người khác thích bài viết của họ.
  - Có bình luận mới vào bài viết của họ.
- Hệ thống notification gồm:
  - Lưu vào MongoDB, phân loại và trạng thái (đã đọc/chưa đọc).
 

## 🚀 Khởi chạy dự án

```bash
# 1. Clone repo
git clone https://github.com/your-username/facebook-clone.git
cd facebook-clone

# 2. Cài đặt dependencies
npm install

# 3. Thiết lập biến môi trường (.env)
# MongoDB, Redis, Firebase, JWT_SECRET, RabbitMQ_URL, ...

# 4. Khởi động server
npm run dev


