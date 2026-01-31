/*
 * Copyright (c) 2025-2026 Your Company Name
 * All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/orphans.css';

const staticOrphans = [
  { id: '1', name: 'Hope Orphanage', qr_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', home_url: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg' },
  { id: '2', name: 'Bright Future', qr_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' }
];

const Orphans = () => {
  const [orphans, setOrphans] = useState([]);
  const [selectedOrphan, setSelectedOrphan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [transactionData, setTransactionData] = useState({
    amount: '',
    name: '',
    email: '',
    phone: '',
    screenshot: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orphanCount, setOrphanCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrphans();
  }, []);

  const fetchOrphans = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/orphans');
      setOrphans(response.data.data || []);
      setOrphanCount(response.data.count || 0);
    } catch (err) {
      console.error('Error fetching orphans:', err);
      setError('Failed to load orphans. Using fallback data.');
      setOrphans(staticOrphans);
      setOrphanCount(staticOrphans.length);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrphan = (orphan) => {
    setSelectedOrphan(orphan);
    setShowPayment(true);
  };

  const handleFileChange = (e) => {
    setTransactionData({ ...transactionData, screenshot: e.target.files[0] });
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    if (!transactionData.screenshot) {
      alert('Please upload a transaction screenshot.');
      return;
    }

    const formData = new FormData();
    formData.append('screenshot', transactionData.screenshot);
    formData.append('type', 'orphan');
    formData.append('item_id', selectedOrphan.id);
    formData.append('item_name', selectedOrphan.name); // Added item_name
    formData.append('amount', transactionData.amount);
    formData.append('name', transactionData.name);
    formData.append('email', transactionData.email);
    formData.append('phone', transactionData.phone);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-transaction', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('Transaction submitted for verification!');
        setShowPayment(false);
        setTransactionData({ amount: '', name: '', email: '', phone: '', screenshot: null });
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error('Error submitting transaction:', err.response?.data || err);
      alert(`Failed to submit transaction: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="donation-container">
      <h1 className="title">Donate to Madrasa ({orphanCount} Available)</h1>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : !showPayment ? (
        <div className="orphans-grid">
          {orphans.length > 0 ? (
            orphans.map((orphan) => (
              <div key={orphan.id} className="orphan-card">
                {orphan.home_url && <img src={orphan.home_url} alt={orphan.name} className="home-image" />}
                <h3 className="orphan-name">{orphan.name}</h3>
                <img src={orphan.qr_url} alt="UPI QR Code" className="qr-code" />
                <button onClick={() => handleSelectOrphan(orphan)} className="donate-button">Donate Now</button>
              </div>
            ))
          ) : (
            <p className="no-results">No Madrasa  available.</p>
          )}
        </div>
      ) : (
        <div className="payment-section">
          <h2 className="payment-title">Donate to {selectedOrphan.name}</h2>
          <img src={selectedOrphan.qr_url} alt="UPI QR Code" className="qr-code" />
          <p>Scan QR to pay via UPI. After payment, upload proof below.</p>
          <form onSubmit={handleSubmitTransaction} className="transaction-form">
            <input
              type="number"
              placeholder="Amount Paid (e.g., 100)"
              value={transactionData.amount}
              onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
              required
              className="input-field"
            />
            <input
              type="text"
              placeholder="Your Name"
              value={transactionData.name}
              onChange={(e) => setTransactionData({ ...transactionData, name: e.target.value })}
              required
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={transactionData.email}
              onChange={(e) => setTransactionData({ ...transactionData, email: e.target.value })}
              required
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={transactionData.phone}
              onChange={(e) => setTransactionData({ ...transactionData, phone: e.target.value })}
              required
              className="input-field"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} required className="input-field" />
            <button type="submit" className="submit-button">Submit Payment Proof</button>
          </form>
          <button className="back-button" onClick={() => setShowPayment(false)}>Back to List</button>
        </div>
      )}
    </div>
  );
};

export default Orphans;