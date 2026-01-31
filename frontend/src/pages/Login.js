/*
 * Copyright (c) 2025-2026 Your Company Name
 * All rights reserved.
 */
// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import '../styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      if (res.data.success) {
        navigate('/user-dashboard', { state: { user: res.data.user } });
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-form"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            whileFocus={{ scale: 1.02, borderColor: '#3498db' }}
            transition={{ duration: 0.2 }}
          />
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            whileFocus={{ scale: 1.02, borderColor: '#3498db' }}
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
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </motion.div>
      
    </div>
  );
}

export default Login;