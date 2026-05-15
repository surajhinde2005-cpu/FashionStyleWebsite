import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCartPlus, FaBolt } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StockWarningModal from './StockWarningModal';
import './OutfitCard.css';

const OutfitCard = ({ outfit, initialFavorite = false, onRemove }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [isFav, setIsFav] = useState(initialFavorite);
  const [adding, setAdding] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Please log in to add to favorites");

    try {
      if (isFav) {
        await api.delete(`/favorites/remove/${outfit._id}`);
        if (onRemove) onRemove(outfit._id);
      } else {
        await api.post('/favorites/add', { outfitId: outfit._id });
      }
      setIsFav(!isFav);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    await addToCart(outfit._id, 'M', 1);
    setAdding(false);
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (outfit.stock > 0 && outfit.stock <= 5) {
      setShowWarning(true);
    } else {
      await proceedToCheckout();
    }
  };

  const proceedToCheckout = async () => {
    setShowWarning(false);
    await addToCart(outfit._id, 'M', 1);
    navigate('/checkout/cart');
  };

  return (
    <>
      <div className="outfit-card animate-fade-in" onClick={() => navigate(`/product/${outfit._id}`)} style={{ cursor: 'pointer' }}>
        <div className="card-image-container">
          <img src={outfit.image} alt={outfit.title} className="card-image" />
          <div className="card-tags">
            <span className="tag">{outfit.season}</span>
            {outfit.stock === 0 && (
              <span className="tag tag-danger">Out of Stock</span>
            )}
            {outfit.stock > 0 && outfit.stock <= 10 && (
              <span className="tag tag-warning">🔥 Only {outfit.stock} left</span>
            )}
            {outfit.stock > 10 && (
              <span className="tag tag-success">In Stock</span>
            )}
          </div>
          <button className="fav-btn" onClick={toggleFavorite}>
            {isFav ? <FaHeart color="#ff3366" /> : <FaRegHeart color="#0f172a" />}
          </button>
        </div>
        <div className="card-content">
          <div className="card-header">
            <h3 className="card-title">{outfit.title}</h3>
            <span className="card-price">₹{outfit.price}</span>
          </div>
          <p className="card-description">{outfit.description}</p>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
            <button 
              className="btn-soft" 
              style={{ flex: 1, padding: '0.85rem 0' }} 
              onClick={handleAddToCart} 
              disabled={adding || outfit.stock === 0}
            >
              {adding ? '...' : <><FaCartPlus size={18} /></>}
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 3 }} 
              onClick={handleBuyNow}
              disabled={outfit.stock === 0}
            >
              {outfit.stock === 0 ? 'Out of Stock' : <><FaBolt /> Buy Now</>}
            </button>
          </div>
        </div>
      </div>
      <StockWarningModal 
        isOpen={showWarning} 
        items={[outfit]} 
        onContinue={proceedToCheckout} 
        onCancel={() => setShowWarning(false)} 
      />
    </>
  );
};

export default OutfitCard;
