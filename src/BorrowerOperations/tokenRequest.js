import React, { useState } from 'react';
import { Client, AccountId, PrivateKey, TokenAssociateTransaction, TokenWipeTransaction } from '@hashgraph/sdk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './tokenRequest.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';

import { auth, database } from '../Firebase/config'; // Import the database instance

function TokenRequestView() {
  const senderAccountId = 'rBtJV7ZfphGij1R6JAfLa2GGQ4UtB4qNB6';
  const recieverAccountId = 'rLcSMxXAmvxzMhiirizpCsiGftRQxZa2Gb';
  const [desiredAmount, setDesiredAmount] = useState('');
  const [interestRate, setInterestRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [requestDate, setRequestDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;


  const handleTokenRequest = async () => {
    try {
      const amount = parseInt(desiredAmount, 10);

      // Store the token request in Firebase Realtime Database
      const tokenRequestsRef = database.ref('token-requests');
      const requestTimestamp = new Date().toISOString().replace(/[.:]/g, '');

      const requestObject = {
        userId, // Include the user ID
        senderAccountId,
        receiverAccountId: recieverAccountId,
        desiredAmount: amount,
        requestTimestamp,
        totalAmount,
      };
      await tokenRequestsRef.child(requestTimestamp).set(requestObject);

      // Display success toast
      toast.success('Loan request placed succesfully!', { autoClose: 3000 });

      
    } catch (error) {
      console.error('Error sending token request:', error);
    }
  };

  const handleCalculateInterest = () => {
    const amount = parseFloat(desiredAmount) ; // Move decimal point 2 steps to the left
    const interest = (amount * 0.2).toFixed(2); // 20% interest rate
    const currentDate = new Date();
    const requestDate = currentDate.toISOString();
    const expiryDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()).toISOString();
    const total = (amount + parseFloat(interest)).toFixed(2);

    setInterestRate(interest);
    setTotalAmount(total);
    setRequestDate(requestDate);
    setExpiryDate(expiryDate);

    toast.info(`Total Amount: ${total}`, { autoClose: 3000 });
    toast.info(`Repayment Date: ${expiryDate}`, { autoClose: 3000 });
  };

  return (
    <div className="container" style={{ color: 'white' }}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ToastContainer />
      <h2 style={{ fontSize: '16px', color: '#FFFFFF' }}>Requests</h2>
      <p className="info-text">Request a new loan below</p>
      <div>
        <label className="label">
          Amount: 
          <input
            type="number"
            value={desiredAmount}
            onChange={(e) => setDesiredAmount(e.target.value)}
            className="input"
          />
        </label>
      </div>
      <div>
        <button onClick={handleCalculateInterest} className="button">
          Calculate Interest
        </button>
        <table className="result-table">
          <tbody>
            <tr>
              <td><p style={{ fontSize: '12px', color: '#FFFFFF' }}>Request Amount:</p></td>
              <td><p style={{ color: '#6BFE53' }}>{(desiredAmount)}</p></td>
            </tr>
            <tr>
              <td><p style={{ fontSize: '12px', color: '#FFFFFF' }}>Interest Amount:</p></td>
              <td><p style={{ color: '#D5FF0A' }}>{interestRate}</p></td>
            </tr>
            <tr>
              <td><p style={{ fontSize: '12px', color: '#FFFFFF' }}>Repayment Amount:</p></td>
              <td><p style={{ color: '#FE7253' }}>{totalAmount}</p></td>
            </tr>
            <tr>
              <td><p style={{ fontSize: '12px', color: '#FFFFFF' }}>Repayment Date:</p></td>
              <td><p>{new Date(expiryDate).toLocaleDateString()}</p></td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          <button onClick={handleTokenRequest} className="button">
            Request Loan
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenRequestView;
