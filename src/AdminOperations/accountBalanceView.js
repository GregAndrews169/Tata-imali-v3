import React, { useState } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { Client, Wallet } from 'xrpl';
import './accountBalanceView.css';
import imali from '../Branding/iMali.png';
import { auth, firestore } from '../Firebase/config';
import logoH from '../Branding/hedera-logo.png';

function AccountBalancesView() {
  const [balances, setBalances] = useState({
    capitalPool: null,
    loanIncome: null,
    transactionFee: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');

  const handleCheckBalance = async (accountType) => {
    setIsLoading(true);
    setSelectedAccount('capitalPool')
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    const assetCode = 'ZAR'; // Asset code to look for
    const xrplAddress = 'rBtJV7ZfphGij1R6JAfLa2GGQ4UtB4qNB6'; // Hardcoded XRPL address
  
    try {
      console.log('Connecting to XRPL...');
      await client.connect();
  
      // Request XRPL account lines (trust lines) for hardcoded address
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
      setBalances(prevBalances => ({ ...prevBalances, [accountType]: parseFloat(zarBalance) }));
    } catch (error) {
      console.error('Error retrieving XRPL balance:', error);
    } finally {
      await client.disconnect();
      setIsLoading(false);
    }
  };
  

  const BalanceTable = ({ accountType }) => (
    <table className="balance-table">
      <tbody>
        <tr>
          <td>Account Type:</td>
          <td>{accountType}</td>
        </tr>
        <tr>
          <td>Balance:</td>
          <td>R {balances[accountType].toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="account-balances-view-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2>iMali Account Balances</h2>
      <button onClick={() => handleCheckBalance('capitalPool')}>Capital Pool Account</button>
      <button onClick={() => handleCheckBalance('loanIncome')}>Loan Income Account</button>
      <button onClick={() => handleCheckBalance('transactionFee')}>Transaction Fee Account</button>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        balances[selectedAccount] != null && <BalanceTable accountType={selectedAccount} />
      )}

      <div className="logo-container">
        <img src={logoH} alt="Logo2" className="logoHm" />
      </div>
    </div>
  );
}

export default AccountBalancesView;
