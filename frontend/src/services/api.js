/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://server-res-five.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;