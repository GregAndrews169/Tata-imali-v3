import React from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './welcome.css'; // Create a corresponding CSS file for styling

function WelcomeScreenAdmin() {
  return (
    <div className="welcome-screen-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logooo" />
      </div>
      <div className="welcome-message">
        <h2>Welcome </h2>
        <p id="usersName">Admin</p>
        <p id="welcome-info-text" >Your job contributes to a revolution</p>
      </div>
    </div>
  );
}

export default WelcomeScreenAdmin;
