/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// server/routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Single connection for all tables
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
  }
});

router.get('/user-stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const users = result.rows;

    // Aggregate data for stats
    const totalUsers = users.length;
    const statusCount = {
      employed: users.filter(u => u.status === 'employed').length,
      graduated: users.filter(u => u.status === 'graduated').length,
      pursuing: users.filter(u => u.status === 'pursuing').length,
    };

    // Aggregate by city, state, country for filters
    const cityCount = {};
    const stateCount = {};
    const countryCount = {};
    users.forEach(user => {
      cityCount[user.city] = (cityCount[user.city] || 0) + 1;
      stateCount[user.state] = (stateCount[user.state] || 0) + 1;
      countryCount[user.country] = (countryCount[user.country] || 0) + 1;
    });

    // Aggregate by qualification, passoutyear, branch with status
    const qualificationByYearStatus = {};
    const branchByQualYearStatus = {};
    users.forEach(user => {
      const qualKey = `${user.qualification}-${user.passoutyear}-${user.status}`;
      const branchKey = `${user.branch}-${user.qualification}-${user.passoutyear}-${user.status}`;
      qualificationByYearStatus[qualKey] = (qualificationByYearStatus[qualKey] || 0) + 1;
      branchByQualYearStatus[branchKey] = (branchByQualYearStatus[branchKey] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      totalUsers,
      statusCount,
      cityCount,
      stateCount,
      countryCount,
      qualificationByYearStatus,
      branchByQualYearStatus
    });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error fetching user stats', error: err.message });
  }
});

router.post('/upload-resume', async (req, res) => {
  try {
    const { email, name } = req.body;
    const resumeFile = req.files.resume;
    if (!resumeFile) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Check file size (less than 2MB)
    if (resumeFile.size > 2 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size exceeds 2MB limit' });
    }

    // Use temporary file path provided by express-fileupload
    const tempPath = resumeFile.tempFilePath || path.join('/tmp', 'uploads', resumeFile.name);
    console.log('Processing file at:', tempPath);

    // If file is not already saved to temp path, save it
    if (!fs.existsSync(tempPath)) {
      await resumeFile.mv(tempPath);
    }

    // Extract text from PDF
    let resumeData = '';
    if (resumeFile.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(tempPath);
      const data = await pdfParse(dataBuffer);
      resumeData = data.text;
    } else {
      resumeData = 'Text extraction for this file type is not supported yet.';
    }

    // Delete temporary file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    // Store in CockroachDB
    const query = `
      INSERT INTO resumes (email, name, resume_data)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET name = $2, resume_data = $3
      RETURNING *
    `;
    const result = await pool.query(query, [email, name, resumeData]);
    res.status(200).json({ success: true, resumeData });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error uploading resume', error: err.message });
  }
});

router.get('/user-resume', async (req, res) => {
  try {
    const { email } = req.query;
    const query = 'SELECT * FROM resumes WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No resume found for this user' });
    }
    res.status(200).json({ success: true, email: result.rows[0].email, resumeData: result.rows[0].resume_data });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error fetching resume', error: err.message });
  }
});

router.get('/resume-users', async (req, res) => {
  try {
    const query = 'SELECT name, email FROM resumes';
    const result = await pool.query(query);
    const users = result.rows.map(user => `${user.name} - ${user.email}`);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error fetching resume users', error: err.message });
  }
});

router.delete('/delete-resume', async (req, res) => {
  try {
    const { email } = req.body;
    const query = 'DELETE FROM resumes WHERE email = $1 RETURNING *';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No resume found for this email' });
    }
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('CockroachDB error:', err);
    res.status(500).json({ success: false, message: 'Error deleting resume', error: err.message });
  }
});

module.exports = router;