import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="section">
      <div className="section-title">
        <h2>Your Cart</h2>
      </div>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="features-grid">
          {cart.map((item, index) => (
            <div key={index} className="feature-card">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              <button
                className="btn btn-outline"
                onClick={() => removeItem(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
