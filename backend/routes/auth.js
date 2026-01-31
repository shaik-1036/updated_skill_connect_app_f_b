/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// server/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  const userData = {
    email: req.body.email,
    fullname: req.body.fullName,
    password: req.body.password,
    dob: req.body.dob,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    qualification: req.body.qualification,
    branch: req.body.branch,
    passoutyear: req.body.passoutYear
  };
  try {
    console.log('Attempting to insert user data into PostgreSQL:', userData);
    const query = `
      INSERT INTO users (email, fullname, password, dob, city, state, country, phone, status, qualification, branch, passoutyear)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      userData.email, userData.fullname, userData.password, userData.dob, userData.city,
      userData.state, userData.country, userData.phone, userData.status, userData.qualification,
      userData.branch, userData.passoutyear
    ];
    const result = await pool.query(query, values);
    console.log('User inserted successfully:', result.rows[0]);
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('PostgreSQL insert error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    return res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = {
      email: result.rows[0].email,
      fullName: result.rows[0].fullname,
      city: result.rows[0].city,
      status: result.rows[0].status,
      qualification: result.rows[0].qualification,
      passoutYear: result.rows[0].passoutyear
    };
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('PostgreSQL login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const query = 'UPDATE users SET password = $1 WHERE email = $2 RETURNING *';
    const result = await pool.query(query, [newPassword, email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('PostgreSQL update error:', err);
    return res.status(500).json({ success: false, message: 'Error updating password', error: err.message });
  }
});

module.exports = router;
