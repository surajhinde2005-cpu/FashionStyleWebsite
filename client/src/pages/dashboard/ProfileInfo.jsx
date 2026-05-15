import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaSave } from 'react-icons/fa';

const ProfileInfo = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', address: { street: '', city: '', state: '', pincode: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) fetchProfile();
    // eslint-disable-next-line
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
      console.error("Failed to fetch profile", err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in profile.address) {
      setProfile({ ...profile, address: { ...profile.address, [name]: value } });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/users/profile', profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="dash-header">
        <h2>Personal Information</h2>
        <p>Update your details and default delivery address to speed up checkout.</p>
      </div>

      {message && (
        <div style={{ background: 'var(--surface-hover)', color: 'var(--primary-color)', padding: '1rem', borderRadius: 'var(--radius-pill)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600' }}>
          <FaCheckCircle style={{ color: 'var(--accent-color)' }} /> {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '3rem' }}>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUser style={{ color: 'var(--text-secondary)' }} /> Account Details
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} required style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input type="email" name="email" value={profile.email} disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaMapMarkerAlt style={{ color: 'var(--text-secondary)' }} /> Delivery Details
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
              <input type="tel" name="phone" placeholder="+91 xxxxx xxxxx" value={profile.phone} onChange={handleChange} style={{ width: '50%' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Street Address</label>
              <input type="text" name="street" placeholder="Flat / House No. / Building / Street" value={profile.address.street} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</label>
                <input type="text" name="city" placeholder="City" value={profile.address.city} onChange={handleChange} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>State</label>
                <input type="text" name="state" placeholder="State" value={profile.address.state} onChange={handleChange} style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pincode</label>
                <input type="text" name="pincode" placeholder="Postal Code" value={profile.address.pincode} onChange={handleChange} style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfo;
