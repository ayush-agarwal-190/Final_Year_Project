import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Navbar';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    fetch('/medicine_data_with_price.json')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item['Medicine Name'] === product['Medicine Name']);
      if (existing) {
        return prev.map(item =>
          item['Medicine Name'] === product['Medicine Name']
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (name) => {
    setCart(cart.map(item =>
      item['Medicine Name'] === name ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (name) => {
    setCart(cart =>
      cart
        .map(item =>
          item['Medicine Name'] === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);

  const filteredProducts = products.filter(p =>
    p['Medicine Name'].toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckoutClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed successfully!\n\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nTotal: ₹${getTotal()}`);
    setCart([]);
    setShowForm(false);
    setFormData({ name: '', address: '', phone: '' });
  };

  return (
    <div className="App">
      <Navbar search={search} setSearch={setSearch} />

      <div className="main-content">
        <div className="products">
          {filteredProducts.map((product, index) => (
            <div className="card" key={index}>
              <img src={product['Image URL']} alt={product['Medicine Name']} />
              <h3>{product['Medicine Name']}</h3>
              <p>{product.Uses.slice(0, 60)}...</p>
              <p><strong>₹{product.Price}</strong></p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>

        <div className="cart">
          <h2>🛒 Cart</h2>
          <ul>
            {cart.map((item, i) => (
              <li key={i}>
                <span>{item['Medicine Name']}</span>
                <div className="qty">
                  <button onClick={() => decreaseQuantity(item['Medicine Name'])}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item['Medicine Name'])}>+</button>
                </div>
                <span>₹{item.Price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{getTotal()}</h3>
          <button onClick={handleCheckoutClick} disabled={cart.length === 0}>
            Checkout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter Delivery Details</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Place Order</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cancel"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
