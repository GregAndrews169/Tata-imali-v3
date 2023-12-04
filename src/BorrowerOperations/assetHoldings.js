import React, { useState, useEffect } from 'react';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { Client, Wallet } from 'xrpl';
import './assetHoldings.css';
import cardIm1 from '../Branding/STX40.png';
import cardIm2 from '../Branding/apl.png';
import cardIm3 from '../Branding/MTN.png';
import imali from '../Branding/iMali.png';


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
      const borrowerWallet = Wallet.fromSeed('sEdTVBUzCxRMG972Zdi2wTvzSq4TR8m');

      const borrowerBalances = await client.request({
        command: 'account_lines',
        account: borrowerWallet.address,
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
        color: '#FFFFFF',
        margin: '0 auto',
        borderCollapse: 'collapse',
        border: '1px solid black',
        backgroundColor: '#363636',
        width: '50%',
      }}>
      <thead>
        <tr>
          <th style={{ padding: '8px', border: '1px solid black', fontSize: '12px' }}>Asset Code</th>
          <th style={{ padding: '8px', border: '1px solid black', fontSize: '12px' }}>Balance</th>
          <th style={{ padding: '8px', border: '1px solid black', fontSize: '12px' }}>Valuation (ZAR)</th>
        </tr>
      </thead>
      <tbody>
        {assetBalances.map((asset, index) => (
          <tr key={index}>
            <td style={{ padding: '8px', border: '1px solid black', fontSize: '16px', color: '#D5FF0A', display: 'flex', alignItems: 'center' }}>
            <img 
              src={getAssetLogo(asset.assetCode)} // Path to your logo images
              alt={asset.assetCode} 
              style={{ width: '30px', height: '30px', marginRight: '5px' }} // Adjust size as needed
            />{asset.assetCode}</td>
            <td style={{ paddingTop: '1px', paddingBottom: '1px', border: '1px solid black', fontSize: '16px', color: '#FFFFFF' }}>{asset.balance}</td>
            <td style={{ padding: '6px', border: '1px solid black', fontSize: '16px', color: '#6BFE53', display: 'flex', alignItems: 'center' }}>{asset.valuation}
                <img 
                src={imali} // Path to your logo images
                style={{ width: '30px', height: '30px', marginLeft: '5px', marginBottom: '0px' }} // Adjust size as needed
                /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const TotalValuationTable = () => (
    <table className="asset-balance-table" style={{
        color: '#FFFFFF',
        margin: '0 auto',
        marginTop: '0px',
        marginBottom: '20px',
        borderCollapse: 'collapse',
        border: '1px solid black',
        backgroundColor: '#363636',
        width: '50%',
      }}>
      <thead>
        <tr>
          <th style={{ padding: '8px', border: '1px solid black', fontSize: '12px' }}>Total Portfolio Valuation (ZAR)</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ marginLeft: '50px'}}>
          <td style={{ marginLeft: '50px', padding: '8px', border: '1px solid black', fontSize: '16px', color: '#6BFE53',  display: 'flex', alignItems: 'center' }}>
            {totalValuation.toFixed(2)}
            <img 
                src={imali} // Path to your logo images
                style={{ width: '30px', height: '30px', marginLeft: '5px', marginBottom: '0px' }} // Adjust size as needed
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
    </div>
  );
}

export default AssetHoldings;
