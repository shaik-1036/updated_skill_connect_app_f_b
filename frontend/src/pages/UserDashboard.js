/*
 * Copyright (c) 2025-2026 Your Company Name
 * All rights reserved.
 */
// src/pages/UserDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageSquare, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/user-dashboard.css';

function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {};
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notifiedMessages, setNotifiedMessages] = useState(new Set());
  const profileRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchResumeData();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messages', {
        params: { category: user.status }
      });
      const newMessages = res.data;
      setMessages(newMessages);
      
      // Only show notification for messages we haven't notified about yet
      const newNotifications = [];
      newMessages.forEach((msg) => {
        const msgKey = `${msg.id || msg.message}-${msg.timestamp}`;
        if (!notifiedMessages.has(msgKey)) {
          newNotifications.push(msgKey);
        }
      });
      
      if (newNotifications.length > 0) {
        setUnreadMessages(prev => prev + newNotifications.length);
        toast.info(`You have ${newNotifications.length} new message(s)!`);
        setNotifiedMessages(prev => new Set([...prev, ...newNotifications]));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const fetchResumeData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-resume?email=${user.email}`);
      if (res.data.success && res.data.resumeData) {
        setResumeData(res.data.resumeData);
      } else {
        setResumeData(null);
      }
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setResumeData(null);
    }
  };

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };

  const handleNotificationClick = () => {
    setUnreadMessages(0);
    const messagesSection = document.querySelector('.messages-section');
    if (messagesSection) {
      messagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email: user.email, newPassword });
      if (res.data.success) {
        alert('Password updated successfully!');
        setIsUpdatingPassword(false);
        setNewPassword('');
      } else {
        alert('Error updating password');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Error updating password');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please select a file to upload');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('email', user.email);
    formData.append('name', user.fullName || 'Unknown');

    try {
      const res = await axios.post('http://localhost:5000/api/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setResumeData(res.data.resumeData);
        alert('Resume uploaded successfully!');
        setResumeFile(null);
      } else {
        alert('Error uploading resume');
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      alert('Error uploading resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      const res = await axios.delete('http://localhost:5000/api/delete-resume', {
        data: { email: user.email }
      });
      if (res.data.success) {
        setResumeData(null);
        alert('Resume deleted successfully!');
      } else {
        alert('Error deleting resume');
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Error deleting resume');
    }
  };

  const handleUpdateResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please select a file to update');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('email', user.email);
    formData.append('name', user.fullName || 'Unknown');

    try {
      const res = await axios.post('http://localhost:5000/api/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setResumeData(res.data.resumeData);
        alert('Resume updated successfully!');
        setResumeFile(null);
      } else {
        alert('Error updating resume');
      }
    } catch (err) {
      console.error('Error updating resume:', err);
      alert('Error updating resume');
    } finally {
      setIsUploading(false);
    }
  };

  // Sort messages by timestamp descending (recent first)
  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="profile-section" ref={profileRef}>
          <div className="profile-icon" onClick={toggleProfile}>
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          {isProfileOpen && (
            <motion.div
              className="profile-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{user.fullName || 'User'}</h3>
              <p>Email: {user.email || 'N/A'}</p>
              <p>City: {user.city || 'N/A'}</p>
              <p>State: {user.state || 'N/A'}</p>
              <p>Country: {user.country || 'N/A'}</p>
              <p>Phone: {user.phone || 'N/A'}</p>
              <p>Status: {user.status || 'N/A'}</p>
              <p>Qualification: {user.qualification || 'N/A'}</p>
              <p>Branch: {user.branch || 'N/A'}</p>
              <p>Passout Year: {user.passoutYear || 'N/A'}</p>
              {!isUpdatingPassword ? (
                <button onClick={() => setIsUpdatingPassword(true)}>Update Password</button>
              ) : (
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                  />
                  <button onClick={handleUpdatePassword}>Save</button>
                  <button onClick={() => setIsUpdatingPassword(false)}>Cancel</button>
                </div>
              )}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </motion.div>
          )}
        </div>
        <div className="action-buttons">
          <button className="whatsapp-btn" onClick={handleWhatsAppRedirect}>
            <MessageSquare size={20} />
          </button>
          <button className="notification-btn" onClick={handleNotificationClick} data-count={unreadMessages}>
            <AlertCircle size={20} />
          </button>
        </div>
      </div>
      <h2>Welcome to Restaurant App</h2>
      <div className="dashboard-content">
        <div className="messages-section">
          <h3>Messages from Admin</h3>
          {sortedMessages.length > 0 ? (
            sortedMessages.map((msg, index) => (
              <motion.div
                key={index}
                className="message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{msg.message}</p>
                <p><small style={{ color: '#e74c3c', textAlign: 'left', display: 'block' }}>Sent on: {new Date(msg.timestamp).toLocaleString()}</small></p>
                <p><small style={{ color: '#7f8c8d', textAlign: 'left', display: 'block' }}>Note: This message will be deleted after 2 days.</small></p>
              </motion.div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
        <div className="resume-section">
          <h3>Upload Your Resume/Doc</h3>
          <form onSubmit={resumeData ? handleUpdateResume : handleResumeUpload} className="upload-form">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="file-input"
            />
            <motion.button
              type="submit"
              disabled={isUploading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {isUploading ? 'Uploading...' : resumeData ? 'Update Resume' : 'Upload Resume'}
              {!isUploading && <Upload size={16} style={{ marginLeft: '0.5rem' }} />}
            </motion.button>
          </form>
          {resumeData && (
            <>
              <div className="resume-display">
                <h4>Your Uploaded Resume/Doc Content</h4>
                <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{resumeData}</p>
              </div>
              <motion.button
                className="delete-resume-btn"
                onClick={handleDeleteResume}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: '1rem' }}
              >
                Delete Resume
                <Trash2 size={16} style={{ marginLeft: '0.5rem' }} />
              </motion.button>
            </>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
    </div>
  );
}

export default UserDashboard;
