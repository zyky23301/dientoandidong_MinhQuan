# Hệ thống QuanChat (QuanChat System)
**Đồ án môn học: Điện toán di động**  
**Sinh viên thực hiện:** Nguyễn Minh Quân  
## 🧐 QuanChat System là một nền tảng giao tiếp trực tuyến nội bộ (ứng dụng Chat) được thiết kế theo mô hình Client-Server. Giao diện được lấy cảm hứng từ các phần mềm chuyên nghiệp với phong cách thiết kế hiện đại **Nord 
---
## 🚀 Các tính năng chính
- **Giao diện đẳng cấp (Premium UI)**: Thiết kế Nord Theme tinh tế kết hợp cấu trúc 3 cột tràn viền (Icon Nav, Danh sách Kênh, Khung Chat) hoàn toàn đáp ứng các tiêu chuẩn thẩm mỹ hiện đại.
- **Hệ thống phân quyền**: Có 2 giao diện riêng biệt cho **Quản trị viên (Admin)** và **Khách hàng (Customer)**.
- **Giao tiếp Real-time giả lập**: Frontend tự động lấy dữ liệu mới (polling) hoặc đồng bộ dữ liệu thông qua LocalStorage giữa các tab mà không cần F5.
- **Tính năng đầy đủ**:
  - Gửi tin nhắn mới.
  - Sửa tin nhắn đã gửi.
  - Xóa toàn bộ lịch sử trò chuyện.
  - Tìm kiếm tin nhắn theo từ khóa ngay tại phía Frontend.
- **Chế độ Ngoại tuyến (Offline Mode)**: Hoạt động mượt mà (sử dụng LocalStorage) ngay cả khi không kết nối được tới Backend Server.
## 🛠 Công nghệ sử dụng
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap Icons.
- **Backend**: Node.js, Express.js.
- **Cơ sở dữ liệu**: Microsoft SQL Server (MSSQL).
- **Kiến trúc**: RESTful API chia luồng rõ ràng (Router, Controller, Config).
## 📂 Cấu trúc thư mục
```
/
├── public/                 # Chứa các file tĩnh Frontend
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css    # Style giao diện Nord Theme
│   │   └── js/
│   │       └── chat-logic.js # Logic xử lý chat và API
│   └── pages/
│       ├── trang-chu.html  # Trang đích (Landing page)
│       ├── khach-hang.html # Trang chat cho Customer
│       └── quan-tri.html   # Trang chat cho Admin
├── server/                 # Chứa mã nguồn Backend Node.js
│   ├── config/
│   │   └── db.js           # Kết nối và cấu hình Database
│   ├── routes/
│   │   └── chat.routes.js  # Các API (GET, POST, PUT, DELETE)
│   └── main.js             # File khởi động Server
├── database.sql            # Script tạo CSDL và Data mẫu
├── package.json            # Cấu hình dự án Node.js
└── README.md               # File tài liệu bạn đang đọc
```
## ⚙️ Hướng dẫn Cài đặt & Khởi động
### Yêu cầu hệ thống:
- [Node.js](https://nodejs.org/en/) (phiên bản 14.x trở lên)
- Microsoft SQL Server (Hoặc SQL Server Express)
- SQL Server Management Studio (SSMS)
### Bước 1: Khởi tạo Cơ sở dữ liệu
1. Mở phần mềm SQL Server Management Studio (SSMS).
2. Copy toàn bộ nội dung trong file `database.sql` và chạy (Execute) để tạo CSDL có tên là `QuanChatApp` cùng với bảng `ChatHistory`.
### Bước 2: Cấu hình kết nối Backend
1. Mở file `server/config/db.js`.
2. Thay đổi thông tin `user` và `password` cho khớp với tài khoản đăng nhập SQL Server của bạn trên máy cá nhân:
```javascript
const sqlSettings = {
    user: 'sa',             // <-- Sửa tên tài khoản SQL
    password: 'your_password', // <-- Sửa mật khẩu
    server: 'localhost',    
    database: 'QuanChatApp',
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};
```
### Bước 3: Cài đặt thư viện và Khởi chạy
1. Mở Command Prompt (hoặc Terminal) và trỏ tới thư mục gốc của dự án.
2. Chạy lệnh cài đặt các thư viện phụ thuộc:
```bash
npm install
```
3. Khởi động server:
```bash
npm start
```
*(Nếu console hiện thông báo "[DB] QuanChatApp Database connected successfully!" và "[SERVER] QuanChat System is running on http://localhost:3000" nghĩa là đã khởi động thành công).*
### Bước 4: Trải nghiệm
Mở trình duyệt web và truy cập vào địa chỉ: **http://localhost:3000**
---
*Chúc bạn có một buổi bảo vệ đồ án thành công!*
