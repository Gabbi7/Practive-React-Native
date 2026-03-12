const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /tasks?userId=xxx
router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks.' });
    }
});

module.exports = router;
