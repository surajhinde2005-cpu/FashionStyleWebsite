import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter';
import OutfitCard from '../components/OutfitCard';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Listing.css';

const Listing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);
  
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    gender: 'All',
    season: 'All',
    category: 'All',
    maxPrice: 10000,
    search: '',
    tags: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFilters = { ...filters };
    let hasParams = false;
    
    for (let [key, value] of params.entries()) {
      if (value) {
        initialFilters[key] = value;
        if (key === 'search') setSearchInput(value);
        hasParams = true;
      }
    }
    
    if (hasParams) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    fetchOutfits();
    if (user) {
      fetchFavorites();
    }
    // eslint-disable-next-line
  }, [filters, user]);

  const fetchOutfits = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.gender !== 'All') queryParams.append('gender', filters.gender);
      if (filters.season !== 'All') queryParams.append('season', filters.season);
      if (filters.category !== 'All') queryParams.append('category', filters.category);
      queryParams.append('maxPrice', filters.maxPrice);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.tags) queryParams.append('tags', filters.tags);

      const res = await api.get(`/outfits?${queryParams.toString()}`);
      setOutfits(res.data);
    } catch (error) {
      console.error("Failed to fetch outfits", error);
    }
    setLoading(false);
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      setFavoriteIds(res.data.map(f => f._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
      <div className="listing-header animate-fade-in" style={{ padding: '20px 20px 0 20px', borderBottom: '1px solid #eaeaec' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 700, color: '#282c3f' }}>Home / Clothing /</span>
            <span style={{ fontWeight: 700, color: '#282c3f' }}>Curated For You</span>
            <span style={{ color: '#535766' }}> - {outfits.length} items</span>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="search-bar" style={{ display: 'flex', gap: '0.5rem', width: '400px' }}>
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', borderRadius: '4px', border: '1px solid #f5f5f6', background: '#f5f5f6', fontSize: '14px' }}
            />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <SidebarFilter filters={filters} setFilters={setFilters} />

        {/* Main Content Area */}
        <main className="listing-main" style={{ flex: 1, padding: '24px' }}>
          {loading ? (
            <div className="loader" style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
          ) : outfits.length === 0 ? (
            <div className="no-results" style={{ textAlign: 'center', marginTop: '50px' }}>
              <h3 style={{ color: '#282c3f' }}>We couldn't find any matches!</h3>
              <p style={{ color: '#535766', marginTop: '10px' }}>Please check the spelling or try searching for something else</p>
            </div>
          ) : (
            <div className="outfits-grid-wide" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', 
              gap: '20px', 
              alignItems: 'start' 
            }}>
              {outfits.map((outfit, index) => (
                <div key={outfit._id} style={{ animationDelay: `${(index % 6) * 0.1}s` }}>
                  <OutfitCard 
                    outfit={outfit} 
                    initialFavorite={favoriteIds.includes(outfit._id)} 
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Listing;
