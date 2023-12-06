import React, { useState } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { Client, Wallet } from 'xrpl'; // Import the XRPL library
import './checkBalance.css';
import imali from '../Branding/iMali.png';
import { auth, firestore } from '../Firebase/config'; // Import the database instance
import logoH from '../Branding/hedera-logo.png';

function TokenBalancesView() {
  const [xrpBalance, setXrpBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBalance = async () => {
    setIsLoading(true);
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    const assetCode = 'ZAR'; // Asset code to look for

    try {
        console.log('Connecting to XRPL...');
        await client.connect();


        

        // Get current authenticated user 
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("No user is currently logged in.");
        }

        // Retrieve XRPL account address from Firestore
        const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
        if (!userDoc.exists) {
            throw new Error("User document not found in Firestore.");
        }

        const xrplAddress = userDoc.data().xrplAddress;
        if (!xrplAddress) {
            throw new Error("XRPL account address not found for the user.");
        }

        // Request XRPL account lines (trust lines)
        const accountLines = await client.request({
            command: 'account_lines',
            account: xrplAddress,
            ledger_index: 'validated'
        });

        // Extract ZAR balance
        let zarBalance = '0';
        accountLines.result.lines.forEach(line => {
            if (line.currency === assetCode) {
                zarBalance = line.balance;
            }
        });

        console.log(`Balance for asset ${assetCode} in account ${xrplAddress}: ${zarBalance}`);
        setXrpBalance(zarBalance); // Set the balance in your component state or UI
    } catch (error) {
        console.error('Error retrieving XRPL balance:', error);
    } finally {
        console.log('Disconnecting from XRPL...');
        await client.disconnect();
        setIsLoading(false);
    }
};



  const XRPLBalanceTable = () => (
    <table
      style={{
        color: '#FFFFFF',
        margin: '20px auto',
        borderCollapse: 'collapse',
        border: '1px solid #4A4A4A',
        backgroundColor: '#363636',
        width: '80%', // Consistent with the other tables
        maxWidth: '1024px', // Maximum width for larger screens
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '12px', border: '1px solid #4A4A4A', fontSize: '16px', fontWeight: 'bold' }}>Asset Code:</td>
          <td style={{ padding: '12px', border: '1px solid #505050', fontSize: '16px', color: '#D5FF0A' }}>ZAR</td>
        </tr>
        <tr>
          <td style={{ padding: '12px', border: '1px solid #4A4A4A', fontSize: '16px', fontWeight: 'bold' }}>Balance:</td>
          <td style={{ padding: '12px', border: '1px solid #505050', fontSize: '18px', color: '#6BFE53', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            R {xrpBalance.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })} {/* Assuming xrpBalance is a number, formatting it to two decimal places */}
            <img 
              src={imali} // Path to your logo images
              alt="Currency Icon" // Provide a meaningful alt text
              style={{ width: '30px', height: '30px' }} // Adjust size as needed
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
  

  return (
    <div className="token-balances-view-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logooo" />
      </div>
      <div className="token-balances-view">
        <h2 style={{ fontSize: '16px', color: '#FFFFFF' }}>iMali-ZAR</h2>
        <div className="logo-container">
        <img src={imali} alt="Logo" className="Mali" />
      </div>
      
        <p className="info-text">Check your iMali-ZAR balance below</p>
        <button onClick={handleCheckBalance}>Check Balance</button>
        {isLoading ? (
          <p style={{ fontSize: '16px', color: '#FFFFFF' }}>Loading...</p>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {xrpBalance !== null ? <XRPLBalanceTable /> : <p style={{ fontSize: '12px', color: '#FFFFFF' }}></p>}
          </div>
        )}
      </div>
      <div className="logo-containerHm">
          <img src={logoH} alt="Logo2" className="logoHm" />
        </div>
    </div>
  );
}

export default TokenBalancesView;
