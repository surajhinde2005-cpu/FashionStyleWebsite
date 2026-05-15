import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import adminApi from '../../services/adminApi';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import '../Auth.css'; // Reusing standard auth styles

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminApi.post('/auth/login', { email, password });
      adminLogin(res.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in" style={{ borderColor: 'var(--primary-color)' }}>
        <div className="auth-header">
          <h2 style={{ color: '#ff4757' }}>Admin Portal</h2>
          <p>Login to manage VogueSync</p>
        </div>

        {error && <div className="error-msg"><FaExclamationCircle /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              className="auth-input" 
              placeholder="Admin Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <FaEnvelope className="input-icon" />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              className="auth-input" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <FaLock className="input-icon" />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Secure Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AdminLogin;
