import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingBag } from 'react-icons/fa';
import { IoMdStar } from 'react-icons/io';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isFav, setIsFav] = useState(false);
  const [adding, setAdding] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkFavorite();
    }
    // eslint-disable-next-line
  }, [id, user]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/outfits/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const checkFavorite = async () => {
    try {
      const res = await api.get('/favorites');
      const isFavorited = res.data.some(f => f._id === id);
      setIsFav(isFavorited);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }
    try {
      const res = await api.post('/favorites/add', { outfitId: id });
      setIsFav(res.data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(id, selectedSize, 1);
    setAdding(false);
    navigate('/checkout/cart'); // Go directly to checkout to place order
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!product) return <div className="no-results">Product not found</div>;

  const originalPrice = Math.floor(product.price * 2.5); // Mock MRP
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="pdp-container">
      <div className="pdp-image-section">
        <img src={product.image} alt={product.title} className="pdp-main-image" />
      </div>
      
      <div className="pdp-details-section">
        <h1 className="pdp-brand">{product.tags && product.tags[2] ? product.tags[2].toUpperCase() : 'VOGUE'} BY DESIGN</h1>
        <h2 className="pdp-title">{product.title}</h2>
        
        <div className="pdp-rating-block">
          <span className="pdp-rating">4.2 <IoMdStar color="#14b8a6" /></span>
          <span className="pdp-rating-count">| 595 Ratings</span>
        </div>

        <div className="pdp-price-block">
          <span className="pdp-current-price">₹{product.price}</span>
          <span className="pdp-original-price">MRP <strike>₹{originalPrice}</strike></span>
          <span className="pdp-discount">({discountPercent}% OFF)</span>
        </div>
        <p className="pdp-taxes">inclusive of all taxes</p>

        <div className="pdp-colors-section">
          <h3 className="pdp-section-title">MORE COLORS</h3>
          <div className="pdp-color-thumbnails">
            <img src={product.image} alt="color 1" className="pdp-color-thumb active" />
            <img src={product.image} alt="color 2" className="pdp-color-thumb" style={{ filter: 'hue-rotate(90deg)' }} />
          </div>
        </div>

        <div className="pdp-sizes-section">
          <div className="pdp-sizes-header">
            <h3 className="pdp-section-title">SELECT SIZE</h3>
            <span className="pdp-size-chart">SIZE CHART &gt;</span>
          </div>
          <div className="pdp-size-buttons">
            {sizes.map(size => (
              <button 
                key={size}
                className={`pdp-size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-actions">
          <button 
            className="pdp-add-to-bag" 
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            <FaShoppingBag /> {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
          </button>
          <button className="pdp-wishlist" onClick={toggleFavorite}>
            {isFav ? <FaHeart color="#ff3e6c" /> : <FaRegHeart />} {isFav ? 'WISHLISTED' : 'WISHLIST'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
