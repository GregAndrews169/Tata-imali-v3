import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { Client, Wallet } from 'xrpl';
import './assetHoldings.css';
import cardIm1 from '../Branding/STX40.png';
import cardIm2 from '../Branding/apl.png';
import cardIm3 from '../Branding/MTN.png';
import imali from '../Branding/iMali.png';
import { auth, firestore } from '../Firebase/config'; // Import the database instance
import logoH from '../Branding/hedera-logo.png';


function AssetHoldings() {
  const [assetBalances, setAssetBalances] = useState([]);
  const [totalValuation, setTotalValuation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const assetPrices = {
    STX: 70.27,
    MTN: 103.36,
    APL: 3251.08,

    
  }
  
  const getAssetLogo = (assetCode) => {
    switch (assetCode) {
      case 'STX':
        return cardIm1;
      case 'APL':
        return cardIm2;
      case 'MTN':
        return cardIm3;
      default:
        return ''; // Or a default image
    }
  };

  const handleCheckAssetBalances = async () => {
    setIsLoading(true);
    const client = new Client('wss://s.altnet.rippletest.net:51233');

    try {
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

      const borrowerBalances = await client.request({
        command: 'account_lines',
        account: xrplAddress,
        ledger_index: 'validated',
      });

      let balances = [];
      if (borrowerBalances.result && borrowerBalances.result.lines) {
        balances = borrowerBalances.result.lines
          .filter(line => ['STX', 'MTN', 'APL'].includes(line.currency))
          .map(line => ({
            assetCode: line.currency,
            balance: line.balance,
            valuation: (parseFloat(line.balance) * assetPrices[line.currency]).toFixed(2),
          }));
      }

      setAssetBalances(balances);
    } catch (error) {
      console.error('Error retrieving asset balances:', error);
    } finally {
      client.disconnect();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const total = assetBalances.reduce((acc, asset) => acc + parseFloat(asset.valuation), 0);
    setTotalValuation(total);
  }, [assetBalances]);

  const AssetBalanceTable = () => (
    <table className="asset-balance-table" style={{
      color: '#363636',
      margin: '20px auto', // More margin for breathing room
      borderCollapse: 'collapse',
      width: '80%', // Adjusted for better spacing
      maxWidth: '1024px', // Maximum width for larger screens
      backgroundColor: '#363636', // Slightly lighter for contrast
      borderRadius: '10px'
    }}>
      <thead>
        <tr>
          <th style={{ padding: '12px', backgroundColor: '#363636', fontSize: '14px', fontWeight: 'bold' }}>Asset Code</th>
          <th style={{ padding: '12px', backgroundColor: '#363636', fontSize: '14px', fontWeight: 'bold' }}>Balance</th>
          <th style={{ padding: '12px', backgroundColor: '#363636', fontSize: '14px', fontWeight: 'bold' }}>Valuation</th>
        </tr>
      </thead>
      <tbody>
        {assetBalances.map((asset, index) => (
          <tr key={index} style={{
            backgroundColor: index % 2 === 0 ? '#363636' : '#2C2C2C', // Zebra striping for rows
            transition: 'background-color 0.3s ease', // Smooth transition for hover effect
            ':hover': { backgroundColor: '#333' } // Darker background on hover
          }}>
            <td style={{ padding: '12px', border: '1px solid #4A4A4A', fontSize: '16px', color: '#FFFFFF', display: 'flex', alignItems: 'center' }}>
              <img 
                src={getAssetLogo(asset.assetCode)} // Path to your logo images
                alt={asset.assetCode} 
                style={{ width: '30px', height: '30px', marginRight: '10px' }} // Adjust size as needed
              />
              {asset.assetCode}
            </td>
            <td style={{ padding: '12px', border: '1px solid #4A4A4A', fontSize: '16px', color: '#BCE20A', textAlign: 'right' }}>
              {asset.balance}
            </td>
            <td style={{ padding: '12px', border: '1px solid #4A4A4A', fontSize: '16px', color: '#6BFE53', textAlign: 'right' }}>
              R {asset.valuation.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}
              <img 
                src={imali} // Path to your currency icon
                style={{ width: '20px', height: '20px', marginLeft: '10px', verticalAlign: 'middle' }} // Adjust size as needed
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
  

  const TotalValuationTable = () => (
    <table className="total-valuation-table" style={{
      color: '#FFFFFF',
      margin: '0 auto',
      marginTop: '20px',
      marginBottom: '20px',
      borderCollapse: 'collapse',
      border: '1px solid black',
      backgroundColor: '#363636',
      width: '60%', // Adjusted for better spacing
      maxWidth: '1024px', // Maximum width for larger screens
    }}>
      <thead>
        <tr>
          <th style={{ padding: '12px', backgroundColor: '#363636', fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>Total Portfolio Valuation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '12px', border: '1px solid black', fontSize: '18px', color: '#6BFE53', backgroundColor: '#505050', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {totalValuation.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}
            <img 
              src={imali} // Path to your logo images
              alt="Currency Icon" // Provide a meaningful alt text
              style={{ width: '30px', height: '30px', marginLeft: '10px' }} // Adjust size as needed
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
  
  
  return (
    <div className="asset-holdings-container">
      <div className="logo-container">
        <img src={logo} alt="Tata iMali Logo" className="logo" />
      </div>
      <div className="asset-holdings-view">
        <h2 style={{ fontSize: '16px', color: '#FFFFFF' }}>Asset Holdings</h2>
        <p style={{ color: '#D5FF0A', fontSize: '12px' }}>Check your asset balances below</p>
        <button onClick={handleCheckAssetBalances} disabled={isLoading}>
          {isLoading ? 'Checking Balances...' : 'Check Asset Balances'}
        </button>
       
        {assetBalances.length > 0 && <TotalValuationTable />}
       
        {assetBalances.length > 0 && <AssetBalanceTable />}
      </div>
      <div className="logo-containerHm">
          <img src={logoH} alt="Logo2" className="logoHm" />
      </div>

    </div>
  );
}

export default AssetHoldings;
