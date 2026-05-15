import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OutfitCard from '../../components/OutfitCard';
import { FaHeart } from 'react-icons/fa';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
    setLoading(false);
  };

  const removeFavorite = (outfitId) => {
    setFavorites(favorites.filter(f => f._id !== outfitId));
  };

  if (loading) return <div>Loading favorites...</div>;

  return (
    <div className="animate-fade-in">
      <div className="dash-header">
        <h2>My Favorites</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Items you've saved for later.</p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <FaHeart style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No favorites yet</h3>
        </div>
      ) : (
        <div className="outfits-grid">
          {favorites.map(outfit => (
            <OutfitCard 
              key={outfit._id} 
              outfit={outfit} 
              initialFavorite={true} 
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
