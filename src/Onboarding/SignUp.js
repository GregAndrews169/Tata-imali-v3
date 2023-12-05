import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import { ToastContainer, toast } from 'react-toastify';
import { auth } from '../Firebase/config';
import { firestore } from '../Firebase/config';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import logo2 from '../Branding/loadingIcon.png';
import { Client, Wallet } from 'xrpl';
import { useNavigate } from 'react-router-dom';

import './SignUp.css';

const SignupPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Enable loading screen at the start
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
          email: userEmail,
          userType: userType,
          firstName: firstName,
          surname: surname,
          xrplAddress: xrplAccount.address,
          xrplPrivateKey: xrplAccount.privateKey
      });


      
      setIsLoading(false);


      history('/login');
    
    
      toast.success('Sign up successful!');

  } catch (error) {
      setIsLoading(false);
      console.error('Sign up error:', error);
      toast.error('Error signing up. Please try again.');
  }
};

const LoadingScreen = () => (
  <div className='mainLoading'>
  <div className="loading-screen-container">
      <div className="logo-container">
          <img src={logo2} alt="Logo" className="loading-logo" />
      </div>
      <div className="loading-text">
          <h2 className='loadingText'>Creating account...</h2>
          {/* You can add more elements like spinners or animations here */}
      </div>
  </div>
  </div>
);


  return (
    isLoading ? 
    <LoadingScreen /> : (
    <div>
      <div className="container">
        <ToastContainer />
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <h2>Sign Up</h2>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="surname">Surname:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Enter your surname"
            />
          </div>
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
  ));
};

export default SignupPage;
