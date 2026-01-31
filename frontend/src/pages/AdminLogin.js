/*
 * Copyright (c) 2025-2026 Your Company Name
 * All rights reserved.
 */
// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../styles/admin-login.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hardcoded admin credentials
    const admin1 = { email: 'admin1@admin-skill-connect.com', password: 'skill@connect90' };
    const admin2 = { email: 'admin2@admin-skill-connect.com', password: 'skill@connect90' };
    
    if ((email === admin1.email && password === admin1.password) || 
        (email === admin2.email && password === admin2.password)) {
      navigate('/admin-dashboard');
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <motion.div
        className="admin-login-form"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Admin Login</h2>
        <p className="warning-text">This is for admin access only. Unauthorized access is prohibited.</p>
        <form onSubmit={handleSubmit}>
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
            whileFocus={{ scale: 1.02, borderColor: '#e67e22' }}
            transition={{ duration: 0.2 }}
          />
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            required
            whileFocus={{ scale: 1.02, borderColor: '#e67e22' }}
            transition={{ duration: 0.2 }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
      
    </div>
  );
}

export default AdminLogin;