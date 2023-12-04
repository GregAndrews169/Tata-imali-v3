import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png'; // Make sure the path to your logo is correct
import './cashFlows.css'; // Adjust the path as necessary
import cash from '../Branding/cash.png';


function Cashflows() {
  return (
    <div className="cashflows-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content-container">
        <h2 className="content-heading">Cashflows</h2>
        <div className="logo-container">
        <img src={cash} alt="Logo" className="logo" />
        </div>
        <p className="info-text">Manage your iMali balance below:</p>
       
        <div className="links-containerCF">
            
          <Link to="/topup" className="cashflow-link">
            Top Up
          </Link>
          <Link to="/cashout" className="cashflow-link">
            Cash Out
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cashflows;
