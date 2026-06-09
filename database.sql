-- Script tạo Cơ sở dữ liệu cho ứng dụng QuanChatApp
-- Sinh viên thực hiện: Nguyễn Minh Quân

CREATE DATABASE QuanChatApp;
GO

USE QuanChatApp;
GO

-- Tạo bảng lịch sử chat (thay thế cho bảng Messages cũ)
CREATE TABLE ChatHistory (
    RecordId INT IDENTITY(1,1) PRIMARY KEY,
    RoleType VARCHAR(50) NOT NULL CHECK (RoleType IN ('admin', 'customer')),
    MessageText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsModified BIT DEFAULT 0 -- 0: false, 1: true
);
GO

-- Thêm một vài dữ liệu mẫu
INSERT INTO ChatHistory (RoleType, MessageText, CreatedAt, IsModified)
VALUES 
('admin', N'Chào bạn, đây là hệ thống hỗ trợ khách hàng. Tôi có thể giúp gì?', GETDATE(), 0),
('customer', N'Chào admin, tôi muốn hỏi về sản phẩm.', DATEADD(minute, 1, GETDATE()), 0);
GO
