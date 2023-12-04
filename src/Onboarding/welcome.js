import React from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './welcome.css'; // Create a corresponding CSS file for styling
import dp from '../Branding/Jermone.png';

function WelcomeScreen() {
  return (
    <div className="welcome-screen-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logooo" />
      </div>
      <div className="welcome-message">
        <h2>Welcome </h2>
        <p id="usersName">Donel</p>
        <div className="logo-container">
        <img src={dp} alt="Logo" className="logooo" />
      </div>
        <p id="welcome-info-text" >Your personal financial revolution awaits</p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
