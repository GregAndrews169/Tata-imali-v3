import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/config';
import { firestore } from '../Firebase/config';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';

import './login.css';

const LoginPage = ({ onLogin, setUserType }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        `${phoneNumber}@yourappdomain.com`,
        password
      );

      // Retrieve user type from Firestore
      const userDoc = await firestore.collection('users').doc(userCredential.user.uid).get();

      if (userDoc.exists) {
        const userType = userDoc.data().userType;
        toast.success('Login successful!');
        onLogin(true); // Indicate that the user is logged in
        setUserType(userType); // Set the user type
      } else {
        toast.error('User not found.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error logging in. Please check your credentials.');
    }
  };

  return (
    <div>
      <div className="container">
        <ToastContainer />
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-loginT" />
          </div>
          <h2>Login</h2>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit">Login</button>
          <p className="new-user">
            New user? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
