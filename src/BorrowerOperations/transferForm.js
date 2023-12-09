import React, { useState } from 'react';
import { Client, Wallet } from 'xrpl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './transferForm.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { firestore, auth } from '../Firebase/config'; // Import the database instance

function TransferForm() {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  async function transferTokens(senderSecret, senderAddress, recipientAddress, amount) {
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    console.log('Connecting to XRPL...');
    await client.connect();

    try {
      

      // Get the current user
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;

  if (!userId) {
      throw new Error("No user ID found for the current user.");
  }

  // Retrieve the XRPL account from Firestore using the userId
  const userDoc = await firestore.collection('users').doc(userId).get();
  if (!userDoc.exists) {
      throw new Error("User document not found in Firestore.");
  }

  // Get the XRPL account address and private key from the user document
  const userXrplAccount = userDoc.data().xrplAddress;
  if (!userXrplAccount) {
      throw new Error("XRPL account address not found for the user.");
  }

  const userXrplKey = userDoc.data().xrplPrivateKey;
  if (!userXrplKey) {
      throw new Error("XRPL private key not found for the user.");
  }

  // Create the borrower's wallet from the XRPL private key
  const borrowerWallet = Wallet.fromSeed(userXrplKey.toString());

  // Prepare the transaction
  const transaction = {
    TransactionType: 'Payment',
    Account: userXrplAccount,
    Amount: {
      currency: 'ZAR',
      value: amount,
      issuer: 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz', // Add the issuer address
    },
    Destination: recipientAddress,
    DestinationTag: 1,
  };

  // Sign and submit the transaction
  const prepared = await client.autofill(transaction);
  const signed = borrowerWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

      if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
        toast.success('Tokens transferred successfully!', { autoClose: 3000 }); // Display success message
        
      } else {
        throw `Error sending transaction: ${result.result.meta.TransactionResult}`;
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      console.log('Disconnecting from XRPL...');
      client.disconnect();
    }
  }

  const handleTransfer = async () => {
    try {
      const borrowerSecret = 'sEdTVBUzCxRMG972Zdi2wTvzSq4TR8m'; // Replace with borrower's secret
      const borrowerAddress = 'rLcSMxXAmvxzMhiirizpCsiGftRQxZa2Gb'; // Replace with borrower's address
      const hotAddress = 'rBtJV7ZfphGij1R6JAfLa2GGQ4UtB4qNB6'; // Replace with hot address

      await transferTokens(borrowerSecret, borrowerAddress, hotAddress, amount);
    } catch (error) {
      console.error('Token transfer failed:', error); // Optional error message
    }
  };

  return (
    <div>
      <div className="container">
        <ToastContainer /> {/* Add the ToastContainer component */}
        <form className="transfer-form" onSubmit={handleSubmit}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <h2>Repayments</h2>
          <p className="info-text">Repay outstanding debt below</p>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button type="submit" onClick={handleTransfer}>
            Repay Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransferForm;
