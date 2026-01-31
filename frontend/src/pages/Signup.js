/*
 * Copyright (c) 2025-2026 Your Company Name
 * All rights reserved.
 */
// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import '../styles/signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '', fullName: '', password: '', dob: '', city: '', state: '',
    country: '', phone: '', status: '', qualification: '', branch: '', passoutYear: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/signup', formData);
      if (res.data.success) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert('Signup failed: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Signup failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <motion.div
        className="signup-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {[
            { name: 'email', type: 'email', placeholder: 'Email', required: true },
            { name: 'fullName', type: 'text', placeholder: 'Full Name', required: true },
            { name: 'password', type: 'password', placeholder: 'Password', required: true },
            { name: 'dob', type: 'date', required: true },
            { name: 'city', type: 'text', placeholder: 'City', required: true },
            { name: 'state', type: 'text', placeholder: 'State', required: true },
            { name: 'country', type: 'text', placeholder: 'Country', required: true },
            { name: 'phone', type: 'tel', placeholder: 'Phone No', required: true },
            { name: 'qualification', type: 'text', placeholder: 'Qualification', required: true },
            { name: 'branch', type: 'text', placeholder: 'Branch', required: true },
            { name: 'passoutYear', type: 'text', placeholder: 'Passout Year', required: true }
          ].map((field, index) => (
            <motion.input
              key={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || field.name}
              required={field.required}
              whileFocus={{ scale: 1.02, borderColor: '#2ecc71' }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            />
          ))}
          <motion.select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02, borderColor: '#2ecc71' }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 11 * 0.05 }}
          >
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="graduated">Graduated</option>
            <option value="pursuing">Pursuing</option>
          </motion.select>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={isSubmitting ? 'submitting' : ''}
          >
            {isSubmitting ? 'Submitting...' : 'Signup'}
          </motion.button>
        </form>
      </motion.div>
      
    </div>
  );
}

export default Signup;