import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import OutfitCard from '../components/OutfitCard';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
    // eslint-disable-next-line
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleRemove = (outfitId) => {
    setFavorites(favorites.filter(f => f._id !== outfitId));
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 80px)' }}>
      <h2 style={{ marginBottom: '2rem', color: '#000000' }}>Your Favorites</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3>No favorites yet.</h3>
          <p>Browse our collections to add some!</p>
        </div>
      ) : (
        <div className="outfits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {favorites.map((outfit) => (
            <OutfitCard 
              key={outfit._id} 
              outfit={outfit} 
              initialFavorite={true} 
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
