import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png'; // Adjust the path if necessary
import './market.css'; // Ensure this is the correct path to your CSS file
import MarketIcon from '../Branding/Shop.png'; // Replace with your market icon path

function Market() {
  return (
    <div className="marketplace-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content-container">
        <h2 className="marketplace-heading">MarketPlace</h2>
        <div className="logo-container">
          <img src={MarketIcon} alt="Market Icon" className="logo" />
        </div>
        <p className="info-text">Explore our marketplace:</p>
        <div className="buttons-container">
          <Link to="/marketplace" className="marketplace-button">
            Explore
          </Link>
          <Link to="/orders" className="marketplace-button">
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Market;
