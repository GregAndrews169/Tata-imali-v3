import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import { ToastContainer, toast } from 'react-toastify';
import { auth } from '../Firebase/config';
import { firestore } from '../Firebase/config';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { Client, Wallet } from 'xrpl';

import './SignUp.css';

const SignupPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const userEmail = `${phoneNumber}@yourappdomain.com`;
      const userCredential = await auth.createUserWithEmailAndPassword(userEmail, password);

      const createXRPLAccount = async () => {
        const client = new Client('wss://s.altnet.rippletest.net:51233');
        console.log("Connecting to Testnet...");
        await client.connect(); 
    
        // Create a wallet and fund it with the Testnet faucet:
        const fund_result = await client.fundWallet()
        const wallet = fund_result.wallet
        console.log(fund_result)
        
        const currency_code = "ZAR";
      
        const trust_set_tx = {
        "TransactionType": "TrustSet",
        "Account": wallet.classicAddress,
        "LimitAmount": {
          "currency": currency_code,
          "issuer": 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz',
          "value": "10000000000" // Large limit, arbitrarily chosen
        }
      };
    
      const ts_prepared = await client.autofill(trust_set_tx);
      const ts_signed = wallet.sign(ts_prepared);
      console.log("Creating trust line from hot address to issuer...");
      const ts_result = await client.submitAndWait(ts_signed.tx_blob);
      if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`);
      } else {
        throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`;
      }
    
        // Additional logic for interacting with the Testnet, if necessary
    
        await client.disconnect(); // Disconnect after the operations are done
    
        return {
            address: wallet.classicAddress,
            privateKey: wallet.privateKey
        };
    };
      // Create an XRPL account
      const xrplAccount = await createXRPLAccount();

      // Store user data and XRPL account details in Firestore
      const userRef = firestore.collection('users').doc(userCredential.user.uid);
      await userRef.set({
          email: userEmail, // Store the user's email
          userType: userType,
          xrplAddress: xrplAccount.address,
          xrplPrivateKey: xrplAccount.privateKey // Caution: Storing private keys in the database
      });

      toast.success('Sign up successful!');
  } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Error signing up. Please try again.');
  }
};

  return (
    <div>
      <div className="container">
        <ToastContainer />
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <h2>Sign Up</h2>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {password.length > 0 && password.length < 6 && (
              <div className="password-warning">Password must be at least 6 characters long</div>
            )}
          </div>
          <div>
            <label htmlFor="userType">User Type:</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="">Select user type</option>
              <option value="Admin">Admin</option>
              <option value="Borrower">Borrower</option>
            </select>
          </div>
          <button type="submit">Sign Up</button>
          <p className="already-have-account">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
