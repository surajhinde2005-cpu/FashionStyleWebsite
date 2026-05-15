import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading) return <div>Loading cart...</div>;

  const items = cart?.items || [];
  const totalAmount = items.reduce((sum, item) => sum + (item.outfitId?.price || 0) * item.quantity, 0);

  return (
    <div className="animate-fade-in">
      <div className="dash-header">
        <h2>My Cart</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Review your selected items before checkout.</p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <FaShoppingBag style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }} />
          <h3>Your cart is empty</h3>
          <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/collections')}>
            Browse Collections
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => {
              if (!item.outfitId) return null; // Safety check
              return (
                <div key={item._id} className="cart-item">
                  <img src={item.outfitId.image} alt={item.outfitId.title} />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.outfitId.title}</div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Size: {item.size}</div>
                    <div className="cart-item-price">₹{item.outfitId.price}</div>
                  </div>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, Math.min(item.outfitId.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.outfitId.stock}
                    >+</button>
                  </div>
                  {item.quantity >= item.outfitId.stock && (
                    <div style={{ color: '#ffa502', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 500 }}>
                      Max stock reached
                    </div>
                  )}

                  <button 
                    style={{ background: 'none', border: 'none', color: '#ff4757', fontSize: '1.2rem', cursor: 'pointer', padding: '1rem' }}
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Subtotal ({items.reduce((acc, curr) => acc + curr.quantity, 0)} items)</p>
              <h3 style={{ color: '#000000', fontSize: '1.8rem' }}>₹{totalAmount.toLocaleString()}</h3>
            </div>
            <button className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }} onClick={() => navigate('/checkout/cart')}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
