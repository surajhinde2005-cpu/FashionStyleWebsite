import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', pincode: '' }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/profile');
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || { street: '', city: '', state: '', pincode: '' }
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'pincode'].includes(name)) {
      setProfile(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/users/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="checkout-loading">Please log in to view your profile.</div>;
  }

  if (loading) {
    return <div className="checkout-loading">Loading profile...</div>;
  }

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
      <div className="auth-card glass animate-fade-in" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h2>My Profile</h2>
          <p>Manage your account and delivery details</p>
        </div>

        {message.text && (
          <div className={message.type === 'error' ? 'error-msg' : 'success-msg'}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <h4 style={{ color: '#000000', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Personal Information</h4>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input type="text" name="name" className="auth-input" style={{ paddingLeft: '1rem' }} value={profile.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email (Cannot be changed)</label>
            <input type="email" className="auth-input" style={{ paddingLeft: '1rem', opacity: 0.6 }} value={profile.email} disabled />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
            <input type="tel" name="phone" className="auth-input" style={{ paddingLeft: '1rem' }} placeholder="+91 XXXXXXXXXX" value={profile.phone} onChange={handleChange} required />
          </div>

          <h4 style={{ color: '#000000', marginBottom: '1rem', marginTop: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Delivery Address</h4>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Street Address</label>
            <input type="text" name="street" className="auth-input" style={{ paddingLeft: '1rem' }} placeholder="House No, Building, Street Area" value={profile.address.street} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>City</label>
              <input type="text" name="city" className="auth-input" style={{ paddingLeft: '1rem' }} value={profile.address.city} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>State</label>
              <input type="text" name="state" className="auth-input" style={{ paddingLeft: '1rem' }} value={profile.address.state} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Pincode</label>
            <input type="text" name="pincode" className="auth-input" style={{ paddingLeft: '1rem' }} value={profile.address.pincode} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={saving}>
            {saving ? <div className="spinner"></div> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
