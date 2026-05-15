import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import '../Auth.css';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminApi.post('/auth/register', { name, email, password });
      setSuccess('Admin Initialized! Redirecting to login...');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize admin.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in" style={{ borderColor: 'var(--primary-color)' }}>
        <div className="auth-header">
          <h2 style={{ color: '#ff4757' }}>Admin Initialization</h2>
          <p>Register the master admin account.</p>
        </div>

        {error && <div className="error-msg"><FaExclamationCircle /> {error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" className="auth-input" placeholder="Admin Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FaUser className="input-icon" />
          </div>
          <div className="form-group">
            <input type="email" className="auth-input" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FaEnvelope className="input-icon" />
          </div>
          <div className="form-group">
            <input type="password" className="auth-input" placeholder="Secure Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FaLock className="input-icon" />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Initialize Admin'}
          </button>
        </form>
        
        <p className="auth-redirect">
          <Link to="/admin/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
