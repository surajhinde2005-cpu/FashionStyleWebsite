import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaExclamationCircle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address');
    }

    setLoading(true);

    // Simulate API call
    try {
      // In a real app: await api.post('/auth/forgot-password', { email });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('If an account exists with this email, a password reset link has been sent to your inbox.');
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass animate-fade-in">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email to receive a password reset link.</p>
        </div>

        {error && <div className="error-msg"><FaExclamationCircle /> {error}</div>}
        {success && <div className="success-msg"><FaCheckCircle /> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              className="auth-input" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <FaEnvelope className="input-icon" />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Send Reset Link'}
          </button>
        </form>
        
        <p className="auth-redirect" style={{ marginTop: '1.5rem' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaArrowLeft /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
