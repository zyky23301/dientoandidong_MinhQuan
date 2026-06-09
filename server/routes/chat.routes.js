const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy tất cả lịch sử chat
router.get('/history', async (req, res) => {
    try {
        const pool = db.getPool();
        const result = await pool.request().query('SELECT * FROM ChatHistory ORDER BY CreatedAt ASC');
        
        const mappedData = result.recordset.map(row => ({
            id: row.RecordId,
            role: row.RoleType,
            text: row.MessageText,
            time: row.CreatedAt,
            isEdited: row.IsModified === 1 || row.IsModified === true
        }));
        
        res.status(200).json(mappedData);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Gửi tin nhắn mới
router.post('/send', async (req, res) => {
    try {
        const { role, text } = req.body;
        const pool = db.getPool();
        const result = await pool.request()
            .input('Role', role)
            .input('Text', text)
            .query('INSERT INTO ChatHistory (RoleType, MessageText) OUTPUT INSERTED.* VALUES (@Role, @Text)');

        const newRecord = result.recordset[0];
        res.status(201).json({
            id: newRecord.RecordId,
            role: newRecord.RoleType,
            text: newRecord.MessageText,
            time: newRecord.CreatedAt,
            isEdited: false
        });
    } catch (error) {
        res.status(500).json({ message: "Error saving message" });
    }
});

// Cập nhật tin nhắn
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const pool = db.getPool();
        
        await pool.request()
            .input('Id', id)
            .input('Text', text)
            .query('UPDATE ChatHistory SET MessageText = @Text, IsModified = 1 WHERE RecordId = @Id');

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ message: "Error updating message" });
    }
});

// Xóa toàn bộ lịch sử
router.delete('/clear', async (req, res) => {
    try {
        const pool = db.getPool();
        await pool.request().query('DELETE FROM ChatHistory'); 
        res.status(200).json({ status: 'cleared' });
    } catch (error) {
        res.status(500).json({ message: "Error clearing chat history" });
    }
});

module.exports = router;
