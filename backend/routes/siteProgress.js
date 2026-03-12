const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `site_${Date.now()}${ext}`);
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST /site-progress  — upload photo + form data
router.post('/', upload.single('photo'), async (req, res) => {
    const { projectName, partner, milestone, location, notes, userId } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const result = await pool.query(
            `INSERT INTO site_progress (project_name, partner, milestone, location, notes, photo_url, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [projectName, partner, milestone, location, notes, photoUrl, userId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save site progress.' });
    }
});

// GET /site-progress
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM site_progress ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch site progress.' });
    }
});

module.exports = router;
