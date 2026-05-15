import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
    setLoading(false);
  };

  const addToCart = async (outfitId, size, quantity = 1) => {
    if (!user) return alert("Please log in to add to cart");
    try {
      const res = await api.post('/cart/add', { outfitId, size, quantity });
      setCart(res.data);
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put('/cart/update', { itemId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error('Error updating cart quantity:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/remove/${itemId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const clearCartState = () => {
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, fetchCart, clearCartState }}>
      {children}
    </CartContext.Provider>
  );
};
