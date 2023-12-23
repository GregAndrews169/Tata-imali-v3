import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './LoanOptions.css';
import Loan from '../Branding/Loan.png';

function LoanOptions() {
  return (
    <div className="loan-options-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content-container">
        <h2 className="content-heading">Loan Options</h2>
        <div className="logo-container">
          <img src={Loan} alt="Loan Options" className="logo" />
        </div>
        <p className="info-text">Choose your loan repayment method:</p>
        <div className="links-container">
          <Link to="/tokenrequest" className="option-link">
            Straight
          </Link>
          <Link to="/loaninstalments" className="option-link">
            Installments
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoanOptions;
