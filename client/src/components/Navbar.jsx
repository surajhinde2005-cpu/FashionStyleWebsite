import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiUser, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          Vogue<span>Sync</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/collections" className="nav-link">Collections</Link>
        </div>
        <div className="nav-actions">
          {user && (
            <Link to="/favorites" className="action-btn" title="Favorites">
              <FiHeart className="icon" />
            </Link>
          )}
          <Link to="/cart" className="action-btn cart-btn" title="Cart">
            <FiShoppingCart className="icon" />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
          
          {user ? (
            <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <span className="user-greeting" style={{ fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer' }}>Hi, {user.name}</span>
              </Link>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <FiLogOut className="icon" />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
