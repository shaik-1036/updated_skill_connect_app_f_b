/*
 * Copyright (c) 2025-2026 Your Company Name
 * All rights reserved.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import '../styles/admin-dashboard.css';

function AdminDashboard() {
  // User-related states
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({ totalUsers: 0, statusCount: {}, cityCount: {}, stateCount: {}, countryCount: {}, qualificationByYearStatus: {}, branchByQualYearStatus: {} });
  const [messageStats, setMessageStats] = useState({ totalMessages: 0, categoryCount: {}, messages: [] });
  const [messages, setMessages] = useState({ employed: '', graduated: '', pursuing: '' });
  const [filter, setFilter] = useState({ city: '', state: '', country: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Donation-related states
  const [qrUpload, setQrUpload] = useState({ name: '', type: 'old-age', qrImage: null, homeImage: null });
  const [oldAgeHomes, setOldAgeHomes] = useState([]);
  const [orphans, setOrphans] = useState([]);
  const [oldAgeStats, setOldAgeStats] = useState([]);
  const [orphanStats, setOrphanStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
    fetchMessageStats();
    fetchData();
  }, []);

  // User-related functions
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user-stats');
      if (res.data.success) {
        setUserStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessageStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/message-stats');
      if (res.data.success) {
        setMessageStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageSend = async (category) => {
    try {
      await axios.post('http://localhost:5000/api/send-message', {
        category,
        message: messages[category]
      });
      alert(`Message sent to ${category} users`);
      setMessages({ ...messages, [category]: '' });
      fetchMessageStats();
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter an email to search');
      setSearchedUser(null);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      const email = searchQuery.trim().toLowerCase();
      const res = await axios.get(`http://localhost:5000/api/user-resume?email=${encodeURIComponent(email)}`);
      if (res.data.success && res.data.resumeData) {
        setSearchedUser(res.data);
      } else {
        setSearchedUser(null);
        setSearchError('No resume found for this user');
      }
    } catch (err) {
      console.error('Error fetching resume:', err.response?.data || err.message);
      setSearchedUser(null);
      setSearchError('Error searching for user resume or no data found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Donation-related functions
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [oldAgeRes, orphansRes, oldAgeStatsRes, orphanStatsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/old-age-homes'),
        axios.get('http://localhost:5000/api/orphans'),
        axios.get('http://localhost:5000/api/old-age-homes-stats'),
        axios.get('http://localhost:5000/api/orphans-stats'),
      ]);
      setOldAgeHomes(oldAgeRes.data.data || []);
      setOrphans(orphansRes.data.data || []);
      setOldAgeStats(oldAgeStatsRes.data.data || []);
      setOrphanStats(orphanStatsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQrUploadChange = (e) => {
    setQrUpload({ ...qrUpload, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit');
      return;
    }
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload a JPEG or PNG file');
      return;
    }
    setQrUpload({ ...qrUpload, [e.target.name]: file });
  };

  const handleQrUpload = async (e) => {
    e.preventDefault();
    if (!qrUpload.name || !qrUpload.qrImage || !qrUpload.type) {
      alert('Please provide name, type, and QR image');
      return;
    }

    const formData = new FormData();
    formData.append('qrImage', qrUpload.qrImage);
    if (qrUpload.homeImage) formData.append('homeImage', qrUpload.homeImage);
    formData.append('name', qrUpload.name);
    formData.append('type', qrUpload.type);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload-qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        alert('QR code uploaded successfully!');
        fetchData();
        setQrUpload({ name: '', type: 'old-age', qrImage: null, homeImage: null });
        document.querySelectorAll('input[type="file"]').forEach(input => (input.value = ''));
      }
    } catch (err) {
      console.error('Frontend upload error:', err.response?.data || err);
      alert(`Failed to upload QR: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getDailyAmount = (stats, name, date) => {
    const stat = stats.find(s => s.item_name === name && s.date === date);
    return stat ? parseFloat(stat.total_amount).toFixed(2) : '0.00';
  };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Prepare chart data for user stats
  const statusData = [
    { name: 'Employed', value: userStats.statusCount.employed || 0 },
    { name: 'Graduated', value: userStats.statusCount.graduated || 0 },
    { name: 'Pursuing', value: userStats.statusCount.pursuing || 0 },
  ];

  const messageData = [
    { name: 'Employed', value: messageStats.categoryCount.employed || 0 },
    { name: 'Graduated', value: messageStats.categoryCount.graduated || 0 },
    { name: 'Pursuing', value: messageStats.categoryCount.pursuing || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Filter users based on selected criteria
  const filteredUsers = users.filter(user => 
    (filter.city === '' || user.city === filter.city) &&
    (filter.state === '' || user.state === filter.state) &&
    (filter.country === '' || user.country === filter.country)
  );

  // Sort messages by timestamp descending (recent first)
  const sortMessagesByRecent = (messages) => {
    return messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* User Statistics Section */}
          <div className="charts-section">
            <h3>User Statistics (Total Users: {userStats.totalUsers})</h3>
            <div className="filter-section">
              <select name="city" value={filter.city} onChange={handleFilterChange}>
                <option value="">Filter by City</option>
                {Object.keys(userStats.cityCount).map(city => (
                  <option key={city} value={city}>{city} ({userStats.cityCount[city]})</option>
                ))}
              </select>
              <select name="state" value={filter.state} onChange={handleFilterChange}>
                <option value="">Filter by State</option>
                {Object.keys(userStats.stateCount).map(state => (
                  <option key={state} value={state}>{state} ({userStats.stateCount[state]})</option>
                ))}
              </select>
              <select name="country" value={filter.country} onChange={handleFilterChange}>
                <option value="">Filter by Country</option>
                {Object.keys(userStats.countryCount).map(country => (
                  <option key={country} value={country}>{country} ({userStats.countryCount[country]})</option>
                ))}
              </select>
            </div>

            <div className="chart-row">
              <div className="chart-container">
                <h4>Status Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>Messages Sent (Last 2 Days: {messageStats.totalMessages})</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: "Category", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-container">
                <h4>Qualification by Passout Year & Status</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(userStats.qualificationByYearStatus).map(([key, value]) => ({ name: key.split('-').join(' '), count: value }))} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0} 
                      height={100} 
                      tick={{ fontSize: 12 }}
                      label={{ value: "Qualification - Year - Status", position: "insideBottom", offset: -90, fontSize: 14 }} 
                    />
                    <YAxis 
                      label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, fontSize: 14 }} 
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>Branch by Qualification, Year & Status</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(userStats.branchByQualYearStatus).map(([key, value]) => ({ name: key.split('-').join(' '), count: value }))} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0} 
                      height={100} 
                      tick={{ fontSize: 12 }}
                      label={{ value: "Branch - Qual - Year - Status", position: "insideBottom", offset: -90, fontSize: 14 }} 
                    />
                    <YAxis 
                      label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10, fontSize: 14 }} 
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Message Sending Section */}
          <div className="message-section">
            <h3>Send Messages to Users</h3>
            <div className="message-boxes">
              <motion.div
                className="message-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h4>Employed Users</h4>
                <textarea
                  value={messages.employed}
                  onChange={(e) => setMessages({ ...messages, employed: e.target.value })}
                  placeholder="Message for employed users"
                  rows={6}
                />
                <button onClick={() => handleMessageSend('employed')}>Send</button>
              </motion.div>
              <motion.div
                className="message-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h4>Graduated Users</h4>
                <textarea
                  value={messages.graduated}
                  onChange={(e) => setMessages({ ...messages, graduated: e.target.value })}
                  placeholder="Message for graduated users"
                  rows={6}
                />
                <button onClick={() => handleMessageSend('graduated')}>Send</button>
              </motion.div>
              <motion.div
                className="message-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h4>Pursuing Users</h4>
                <textarea
                  value={messages.pursuing}
                  onChange={(e) => setMessages({ ...messages, pursuing: e.target.value })}
                  placeholder="Message for pursuing users"
                  rows={6}
                />
                <button onClick={() => handleMessageSend('pursuing')}>Send</button>
              </motion.div>
            </div>
          </div>

          {/* Message History Section */}
          <div className="message-history-section">
            <h3>Sent Messages History (Last 2 Days)</h3>
            <div className="message-history-container">
              <div className="message-history">
                <h4>Employed</h4>
                {messageStats.messages.filter(m => m.category === 'employed').length > 0 ? (
                  sortMessagesByRecent([...messageStats.messages.filter(m => m.category === 'employed')])
                    .map((msg, index) => (
                      <div key={index} className="message-history-item">
                        <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{msg.message}</p>
                        <p><small style={{ textAlign: 'left', display: 'block' }}>Sent on: {new Date(msg.timestamp).toLocaleString()}</small></p>
                      </div>
                    ))
                ) : (
                  <p>No messages sent to Employed users.</p>
                )}
              </div>
              <div className="message-history">
                <h4>Graduated</h4>
                {messageStats.messages.filter(m => m.category === 'graduated').length > 0 ? (
                  sortMessagesByRecent([...messageStats.messages.filter(m => m.category === 'graduated')])
                    .map((msg, index) => (
                      <div key={index} className="message-history-item">
                        <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{msg.message}</p>
                        <p><small style={{ textAlign: 'left', display: 'block' }}>Sent on: {new Date(msg.timestamp).toLocaleString()}</small></p>
                      </div>
                    ))
                ) : (
                  <p>No messages sent to Graduated users.</p>
                )}
              </div>
              <div className="message-history">
                <h4>Pursuing</h4>
                {messageStats.messages.filter(m => m.category === 'pursuing').length > 0 ? (
                  sortMessagesByRecent([...messageStats.messages.filter(m => m.category === 'pursuing')])
                    .map((msg, index) => (
                      <div key={index} className="message-history-item">
                        <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{msg.message}</p>
                        <p><small style={{ textAlign: 'left', display: 'block' }}>Sent on: {new Date(msg.timestamp).toLocaleString()}</small></p>
                      </div>
                    ))
                ) : (
                  <p>No messages sent to Pursuing users.</p>
                )}
              </div>
            </div>
          </div>

          {/* Search User Resume Section */}
          <div className="search-section">
            <h3>Search User Resume/Docs</h3>
            <div className="search-container-wrapper">
              <div className="user-table-container">
                <h4>Users</h4>
                {users.length > 0 ? (
                  <div className="user-table-wrapper" style={{ maxHeight: users.length > 5 ? '200px' : 'auto', overflowY: users.length > 5 ? 'auto' : 'visible' }}>
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>Email ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr
                            key={index}
                            className="user-table-row"
                            onClick={() => {
                              setSearchQuery(user.email);
                              handleSearch();
                            }}
                          >
                            <td>{user.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No users found.</p>
                )}
              </div>
              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchedUser(null);
                    setSearchError('');
                  }}
                  placeholder="Enter user email (e.g., test12@gmail.com)"
                  className="search-input"
                />
                <button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            {searchError && (
              <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                {searchError}
              </p>
            )}
            {searchedUser && (
              <div className="document-display">
                <h4>Selected User: {searchedUser.email}</h4>
                <p style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{searchedUser.resumeData}</p>
              </div>
            )}
          </div>

          {/* Donation Management Section */}
          <div className="qr-upload-section">
            <h3 className="section-title">Upload QR Code for Donations</h3>
            <form onSubmit={handleQrUpload} className="qr-upload-form">
              <input
                type="text"
                name="name"
                value={qrUpload.name}
                onChange={handleQrUploadChange}
                placeholder="Name (e.g., Sunshine Old Age Home)"
                required
                className="input-field"
              />
              <select name="type" value={qrUpload.type} onChange={handleQrUploadChange} required className="input-field">
                <option value="old-age">Masjids</option>
                <option value="orphan">Madrasa</option>
              </select>
              <input type="file" accept="image/jpeg,image/png" name="qrImage" onChange={handleFileChange} required className="input-field" />
              <input type="file" accept="image/jpeg,image/png" name="homeImage" onChange={handleFileChange} className="input-field" />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload QR Code'}
              </button>
            </form>
          </div>
          <div className="stats-section">
            <h3 className="section-title">Old Age Homes ({oldAgeHomes.length})</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>QR Code</th>
                  <th>Home Image</th>
                  <th>Today (₹)</th>
                  <th>Yesterday (₹)</th>
                </tr>
              </thead>
              <tbody>
                {oldAgeHomes.length > 0 ? (
                  oldAgeHomes.map(home => (
                    <tr key={home.id}>
                      <td>{home.name}</td>
                      <td><img src={home.qr_url} alt="QR" className="table-image" /></td>
                      <td>{home.home_url ? <img src={home.home_url} alt="Home" className="table-image" /> : 'N/A'}</td>
                      <td>{getDailyAmount(oldAgeStats, home.name, today)}</td>
                      <td>{getDailyAmount(oldAgeStats, home.name, yesterday)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No old age homes added.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <h3 className="section-title">Orphans ({orphans.length})</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>QR Code</th>
                  <th>Home Image</th>
                  <th>Today (₹)</th>
                  <th>Yesterday (₹)</th>
                </tr>
              </thead>
              <tbody>
                {orphans.length > 0 ? (
                  orphans.map(orphan => (
                    <tr key={orphan.id}>
                      <td>{orphan.name}</td>
                      <td><img src={orphan.qr_url} alt="QR" className="table-image" /></td>
                      <td>{orphan.home_url ? <img src={orphan.home_url} alt="Home" className="table-image" /> : 'N/A'}</td>
                      <td>{getDailyAmount(orphanStats, orphan.name, today)}</td>
                      <td>{getDailyAmount(orphanStats, orphan.name, yesterday)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orphans added.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;