import React from 'react';
import './SidebarFilter.css';

const SidebarFilter = ({ filters, setFilters }) => {
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const currentCategories = filters.category === 'All' ? [] : filters.category.split(',');
    
    let newCategories;
    if (e.target.checked) {
      newCategories = [...currentCategories, value];
    } else {
      newCategories = currentCategories.filter(c => c !== value);
    }
    
    setFilters({ ...filters, category: newCategories.length ? newCategories.join(',') : 'All' });
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, maxPrice: e.target.value });
  };

  const categories = ['Casual', 'Formal', 'Party', 'Utility', 'Sportswear', 'Streetwear', 'Vintage', 'Bohemian', 'Chic'];
  const brands = ['Vogue by Design', 'HRX', 'Puma', 'Roadster', 'Urbanic'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink'];

  return (
    <div className="sidebar-filter-vertical">
      <div className="sidebar-header">
        <h3 className="filter-title">FILTERS</h3>
        <span className="clear-all" onClick={() => setFilters({...filters, category: 'All', maxPrice: 10000})}>CLEAR ALL</span>
      </div>
      
      <div className="filter-section">
        <h4 className="section-title">CATEGORIES</h4>
        <div className="checkbox-group">
          {categories.map(cat => (
            <label key={cat} className="checkbox-label">
              <input 
                type="checkbox" 
                value={cat} 
                checked={filters.category !== 'All' && filters.category.split(',').includes(cat)}
                onChange={handleCategoryChange}
              />
              <span className="checkmark"></span>
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="section-title">BRAND</h4>
        <div className="checkbox-group">
          {brands.map(brand => (
            <label key={brand} className="checkbox-label">
              <input type="checkbox" value={brand} />
              <span className="checkmark"></span>
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="section-title">PRICE</h4>
        <div className="price-slider-container">
          <label className="price-label">Up to: ₹{filters.maxPrice || 10000}</label>
          <input 
            type="range" 
            name="maxPrice" 
            min="500" 
            max="10000" 
            step="500" 
            value={filters.maxPrice || 10000} 
            onChange={handlePriceChange} 
            className="myntra-range-slider"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4 className="section-title">COLOR</h4>
        <div className="checkbox-group color-group">
          {colors.map(color => (
            <label key={color} className="checkbox-label color-label">
              <input type="checkbox" value={color} />
              <div className="color-indicator" style={{ backgroundColor: color.toLowerCase() }}></div>
              {color}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
