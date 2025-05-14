import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header>
    <div className="navbar">
      <h1 className="logo">Online Pharmacy</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
      </ul>
    </div>
  </header>
);

export default Header;
