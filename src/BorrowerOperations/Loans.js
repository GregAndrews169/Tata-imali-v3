import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png'; // Update the path to your logo as necessary
import './Loans.css'
import Loan from '../Branding/Loan.png';

function Loans() {
  return (
    <div className="loans-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content-container">
        <h2 className="content-heading">Loans</h2>
        <div className="logo-container">
        <img src={Loan} alt="Logo" className="logo" />
        </div>
        <p className="info-text">Select a loan option below:</p>
        <div className="links-containerL">
          <Link to="/tokenrequest" className="loan-link">
            New Loan
          </Link>
          <Link to="/transfer" className="loan-link">
            Repayments
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Loans;
