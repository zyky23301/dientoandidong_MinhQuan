const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/v1/chat', chatRoutes);

// Fallback route cho frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/trang-chu.html'));
});

// Khởi động server và kết nối DB
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`[SERVER] QuanChat System is running on http://localhost:${PORT}`);
    });
};

startServer();
