import React from 'react';
import './Navbar.css'; // Optional CSS file

const Navbar = ({ search, setSearch }) => {
  return (
    <header>
      <h1>💊 Medicine Store</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>
    </header>
  );
};

export default Navbar;
