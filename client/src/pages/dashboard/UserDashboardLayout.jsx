import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaBoxOpen, FaHeart, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

const UserDashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/profile', icon: <FaUser />, label: 'Profile Info' },
    { path: '/profile/orders', icon: <FaBoxOpen />, label: 'My Orders' },
    { path: '/profile/favorites', icon: <FaHeart />, label: 'Favorites' },
    { path: '/profile/cart', icon: <FaShoppingCart />, label: 'My Cart' },
  ];

  return (
    <div className="container dashboard-container">
      <aside className="dashboard-sidebar glass">
        <div className="dashboard-sidebar-header">
          <h3>My Account</h3>
          <p>{user.email}</p>
        </div>
        <nav className="dashboard-nav">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`dashboard-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <button className="dashboard-nav-link logout-btn-dash" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main glass">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
