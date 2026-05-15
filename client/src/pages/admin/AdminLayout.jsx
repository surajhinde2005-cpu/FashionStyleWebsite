import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import { FaTachometerAlt, FaBoxOpen, FaTshirt, FaSignOutAlt } from 'react-icons/fa';
import './Admin.css';

const AdminLayout = () => {
  const { admin, adminLogout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!admin) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <FaBoxOpen />, label: 'Orders' },
    { path: '/admin/stock', icon: <FaTshirt />, label: 'Stock / Outfits' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="admin-logo">
          Vogue<span>Sync</span> Admin
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Logged in as: <strong>{admin.name}</strong>
          </div>
          <button className="btn-outline w-100" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
