import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png'; // Make sure the path to your logo is correct
import './accounts.css'
import Wallet from '../Branding/Wallet.png';

function Accounts() {
  return (
    <div className="accounts-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content-container">
        <h2 className="content-heading">Accounts</h2>
        <div className="logo-container">
        <img src={Wallet} alt="Logo" className="logo" />
        </div>
        <p className="info-text">View your account balances below:</p>
        <div className="links-containerAC">
          <Link to="/assetholdings" className="account-link">
            Assets
          </Link>
          <Link to="/checkbalance" className="account-link">
            iMali-ZAR
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
