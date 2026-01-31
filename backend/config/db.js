/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

console.log('[v0] DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('[v0] NODE_ENV:', process.env.NODE_ENV);
console.log('[v0] SSL enabled:', process.env.NODE_ENV === 'production');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('[v0] Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('[v0] Successfully connected to PostgreSQL');
});

// Function to check if tables exist
const initTables = async () => {
  try {
    // Check users table
    const usersResult = await pool.query('SELECT * FROM users LIMIT 1');
    console.log('Users table exists and is accessible.');

    // Check messages table
    const messagesResult = await pool.query('SELECT * FROM messages LIMIT 1');
    console.log('Messages table exists and is accessible.');

    // Check resumes table
    const resumesResult = await pool.query('SELECT * FROM resumes LIMIT 1');
    console.log('Resumes table exists and is accessible.');
  } catch (err) {
    console.error('Error checking tables:', err.message);
    console.log('Ensure tables (users, messages, resumes) are created in PostgreSQL.');
  }
};

initTables();

module.exports = pool;
