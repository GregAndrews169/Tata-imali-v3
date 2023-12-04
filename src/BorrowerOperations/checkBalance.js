import React, { useState } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { Client, Wallet } from 'xrpl'; // Import the XRPL library
import './checkBalance.css';
import imali from '../Branding/iMali.png';

function TokenBalancesView() {
  const [xrpBalance, setXrpBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBalance = async () => {
    setIsLoading(true);

    // Create an XRPL client
    const client = new Client('wss://s.altnet.rippletest.net:51233');

    try {
      console.log('Connecting to XRPL...');
      await client.connect();

      // XRPL account details
      const borrowerAddress = 'rLcSMxXAmvxzMhiirizpCsiGftRQxZa2Gb';
      const borrowerSecret = 'sEdTVBUzCxRMG972Zdi2wTvzSq4TR8m';
      const assetCode = 'ZAR';
      const issuerAddress = 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz';

      // Create an XRPL Wallet
      const borrowerWallet = Wallet.fromSeed(borrowerSecret);

      // Request XRPL account lines
      const borrowerBalances = await client.request({
        command: 'account_lines',
        account: borrowerWallet.address,
        ledger_index: 'validated',
      });

      // Extract ZAR balance
      let zarBalance = '0';
      if (
        borrowerBalances.result &&
        borrowerBalances.result.lines &&
        Array.isArray(borrowerBalances.result.lines)
      ) {
        const lines = borrowerBalances.result.lines;
        for (const line of lines) {
          if (line.currency === assetCode && line.account === issuerAddress) {
            zarBalance = line.balance;
            break;
          }
        }
      }

      console.log(`Borrower account balance for ${assetCode}: ${zarBalance}`);
      setXrpBalance(zarBalance);
    } catch (error) {
      console.error('Error retrieving XRPL balance:', error);
    } finally {
      // Disconnect the XRPL client
      console.log('Disconnecting from XRPL...');
      client.disconnect();
      setIsLoading(false);
    }
  };

  const XRPLBalanceTable = () => (
    <table
      style={{
        color: '#FFFFFF',
        margin: '0 auto',
        borderCollapse: 'collapse',
        border: '1px solid black',
        backgroundColor: '#363636',
        width: '50%', // Adjust the width as needed
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '8px', border: '1px solid black', fontSize: '12px' }}>Asset Code:</td>
          <td style={{ padding: '8px', border: '1px solid black', fontSize: '16px', color: '#D5FF0A' }}>ZAR</td>
        </tr>
        <tr>
          <td style={{ padding: '8px', border: '1px solid black', fontSize: '12px' }}>Balance:</td>
          <td style={{ padding: '8px', border: '1px solid black', fontSize: '16px', color: '#6BFE53', display: 'flex', alignItems: 'center' }}>{xrpBalance}
          <img 
              src={imali} // Path to your logo images
              
              style={{ width: '30px', height: '30px', marginLeft: '5px', marginBottom: '0px' }} // Adjust size as needed
            /></td>
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
    </div>
  );
}

export default TokenBalancesView;
