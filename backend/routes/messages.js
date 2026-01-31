/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// server/routes/messages.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { sendEmailNotification } = require('../utils/email');

router.post('/send-message', async (req, res) => {
  const { category, message } = req.body;
  const timestamp = new Date().toISOString();
  try {
    const insertQuery = 'INSERT INTO messages (category, message, timestamp) VALUES ($1, $2, $3) RETURNING *';
    const insertResult = await pool.query(insertQuery, [category, message, timestamp]);

    // Fetch users in the specified category for email notification
    const usersQuery = 'SELECT email FROM users WHERE status = $1';
    const usersResult = await pool.query(usersQuery, [category]);

    // Send email to all users in the category
    usersResult.rows.forEach(user => {
      sendEmailNotification(user.email, message);
    });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error sending message', error: err.message });
  }
});

router.get('/messages', async (req, res) => {
  const { category } = req.query;
  try {
    // Delete messages older than 2 days
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const deleteQuery = 'DELETE FROM messages WHERE timestamp < $1';
    await pool.query(deleteQuery, [twoDaysAgo]);

    // Fetch messages
    let query = 'SELECT * FROM messages WHERE timestamp >= $1';
    const values = [twoDaysAgo];
    if (category) {
      query += ' AND category = $2';
      values.push(category);
    }
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error fetching messages', error: err.message });
  }
});

router.get('/message-stats', async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const query = 'SELECT * FROM messages WHERE timestamp >= $1';
    const result = await pool.query(query, [twoDaysAgo]);

    const totalMessages = result.rows.length;
    const categoryCount = {
      employed: result.rows.filter(m => m.category === 'employed').length,
      graduated: result.rows.filter(m => m.category === 'graduated').length,
      pursuing: result.rows.filter(m => m.category === 'pursuing').length,
    };

    res.status(200).json({
      success: true,
      totalMessages,
      categoryCount,
      messages: result.rows
    });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error fetching message stats', error: err.message });
  }
});

module.exports = router;