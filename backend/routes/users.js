const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

// GET /users/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// PATCH /users/:id/profile  — update name
router.patch('/:id/profile', async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, first_name, last_name, email',
            [firstName, lastName, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// PATCH /users/:id/account  — update email and/or password
router.patch('/:id/account', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE users SET email = $1, password_hash = $2 WHERE id = $3',
                [email, hashed, req.params.id]
            );
        } else {
            await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, req.params.id]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update account.' });
    }
});

module.exports = router;
