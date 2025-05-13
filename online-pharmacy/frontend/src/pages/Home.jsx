import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setMedicines(data);
        setFilteredMedicines(data);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = medicines.filter((med) =>
      med.name.toLowerCase().includes(term)
    );
    setFilteredMedicines(filtered);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    alert("Added to cart!");
  };

  return (
    <div className="section">
      <div className="section-title">
        <h2>Available Medicines</h2>
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredMedicines.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <div className="features-grid">
          {filteredMedicines.map((med) => (
            <div key={med.id} className="feature-card">
              <img
                src={med.image}
                alt={med.name}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h3>{med.name}</h3>
              <p>{med.description}</p>
              <p>
                <strong>${med.price.toFixed(2)}</strong>
              </p>
              <Link className="btn" to={`/product/${med.id}`}>
                View
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => addToCart(med)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
