/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
const express = require("express")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const fs = require("fs")
const path = require("path")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const messageRoutes = require("./routes/messages")
const uploadRoutes = require("./routes/admin") // Changed from admin to upload
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000;

// Use /tmp directory for serverless environments like Vercel
const tempDir = process.env.TEMP_DIR || path.join('/tmp', 'uploads');
if (!fs.existsSync(tempDir)) {
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('Temporary directory created:', tempDir);
  } catch (err) {
    console.error('Error creating temporary directory:', err);
  }
}



app.use(cors());
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 2 * 1024 * 1024 // 2MB max file size
  },
  useTempFiles: true,
  tempFileDir: tempDir // Use /tmp directory for serverless compatibility
}));

// Root route for testing
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend Server is Running' });
});

// Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", messageRoutes)
app.use("/api", uploadRoutes)

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});