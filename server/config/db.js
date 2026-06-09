const sql = require('mssql');

const sqlSettings = {
    user: 'sa',             // Thay bằng username SQL của bạn
    password: 'your_password', // Thay bằng mật khẩu SQL của bạn
    server: 'localhost',    
    database: 'QuanChatApp',  // Tên Database mới
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

let dbConnection;

const connectDB = async () => {
    try {
        dbConnection = await sql.connect(sqlSettings);
        console.log("[DB] QuanChatApp Database connected successfully!");
    } catch (error) {
        console.error("[DB ERROR] Connection failed:", error);
    }
};

const getPool = () => dbConnection;

module.exports = {
    connectDB,
    getPool
};
