import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { FaShoppingCart, FaDollarSign, FaUsers, FaTshirt } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalOutfits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.get('/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>Dashboard Overview</h2>
      
      <div className="stat-cards">
        <div className="stat-card glass">
          <div className="stat-icon"><FaShoppingCart /></div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h3>Registered Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon"><FaTshirt /></div>
          <div className="stat-info">
            <h3>Outfits in Stock</h3>
            <p>{stats.totalOutfits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
