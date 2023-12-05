
import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import './welcome.css'; // Create a corresponding CSS file for styling
import dp from '../Branding/Jermone.png';
import { auth, firestore } from '../Firebase/config'; // Import the database instance


function WelcomeScreen() {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.surname}`);
        }
      }
    };

    fetchUserData();
  }, []);


  return (
    <div className="welcome-screen-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logooo" />
      </div>
      <div className="welcome-message">
        <h2>Welcome </h2>
        <p id="usersName">{userName}</p>
        <div className="logo-container">
        <img src={dp} alt="Logo" className="logooo" />
      </div>
        <p id="welcome-info-text" >Your personal financial revolution awaits</p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
