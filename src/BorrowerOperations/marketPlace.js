import React, { useState } from 'react';
import './marketPlace.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import cardIm1 from '../Branding/STX40.png';
import cardIm2 from '../Branding/apl.png';
import cardIm3 from '../Branding/MTN.png';
import imali from '../Branding/iMali.png';
import { auth, database } from '../Firebase/config'; // Import the database instance


const assets = [
  {
    id: 'STX',
    name: 'Satrix 40',
    description: 'Tokenised ETF',
    buyPrice: 70.27,
    sellPrice: 69.50, // Assuming sell price is a bit lower than buy price
    image: cardIm1,
  },
  {
    id: 'MTN',
    name: 'MTN',
    description: 'Tokenised Equity',
    buyPrice: 103.36,
    sellPrice: 102.01,
    image: cardIm3,
  },
  {
    id: "APL",
    name: 'Apple INC',
    description: 'Tokenised Equity',
    buyPrice: 3251.08,
    sellPrice: 3200.01,
    image: cardIm2,
  },
];

function Marketplace() {
  const [purchaseAmount, setPurchaseAmount] = useState({});
  const [totalPrice, setTotalPrice] = useState({});
  const [showPurchase, setShowPurchase] = useState({});
  const [sellAmount, setSellAmount] = useState({});
  const [sellTotal, setSellTotal] = useState({});
  const [showSell, setShowSell] = useState({});
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;
  const [isAssetRequested, setIsAssetRequested] = useState(false); 


  const handlePurchaseClick = (assetId) => {
    setShowPurchase({ ...showPurchase, [assetId]: true });
    setShowSell({ ...showSell, [assetId]: false });
  };

  const handleSellClick = (assetId) => {
    setShowSell({ ...showSell, [assetId]: true });
    setShowPurchase({ ...showPurchase, [assetId]: false });
  };

  const handleBuyNow = async (assetId, assetName, price) => {
    try {
      setIsAssetRequested(true);
      const purchaseRef = database.ref('asset-purchases');
      const purchaseTimestamp = new Date().toISOString().replace(/[.:]/g, '');

      const purchaseObject = {
        assetId,
        purchaseAmount: purchaseAmount[assetId],
        totalPrice: totalPrice[assetId],
        purchaseTimestamp,
        userId, // Include the user ID
        status: 'Requested'
      };

      await purchaseRef.child(purchaseTimestamp).set(purchaseObject);

      toast.success(`Succesfully placed purchase request for ${purchaseAmount[assetId]} units of ${assetName} for ${totalPrice[assetId]} ZAR`, { autoClose: 3000 });
    } catch (error) {
      console.error('Error processing purchase:', error);
    }
  };

  const handleSellNow = async (assetId, assetName, price) => {
    try {
      setIsAssetRequested(true);
      const sellRef = database.ref('asset-sales');
      const sellTimestamp = new Date().toISOString().replace(/[.:]/g, '');

      const sellObject = {
        assetId,
        sellAmount: sellAmount[assetId],
        sellTotal: sellTotal[assetId],
        sellTimestamp,
        userId, // Include the user ID
        status: 'Requested'
      };

      await sellRef.child(sellTimestamp).set(sellObject);

      toast.success(`Succesfully placed sale request for ${sellAmount[assetId]} units of ${assetName} for ${sellTotal[assetId]} ZAR`, { autoClose: 3000 });
    } catch (error) {
      console.error('Error processing sell:', error);
    }
  };

  const handleAmountChange = (e, assetId, price, isBuying = true) => {
    const amount = e.target.value;
    const calculatedTotal = parseFloat((amount * price).toFixed(2));
  
    if (isBuying) {
      setPurchaseAmount({ ...purchaseAmount, [assetId]: amount });
      setTotalPrice({ ...totalPrice, [assetId]: calculatedTotal });
    } else {
      setSellAmount({ ...sellAmount, [assetId]: amount });
      setSellTotal({ ...sellTotal, [assetId]: calculatedTotal });
    }
  };
  

  return (
    <div className="marketplace-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logooo" />
      </div>
      <h2 style={{ fontSize: '16px', color: '#FFFFFF', textAlign: 'center' }}>Marketplace</h2>
      <ToastContainer />
      <div className='cards-container' style={{ overflowY: 'scroll' }}>
  {assets.map((asset) => (
    <div key={asset.id} className="card">
      <h3 style={{ fontSize: '16px', color: '#FFFFFF', textAlign: 'center' }}>{asset.name}</h3>
      <div className="logo-container">
        <img src={asset.image} alt={asset.name} className="stxIm" />
      </div>
      <p style={{ fontSize: '12px', color: '#FFFFFF', textAlign: 'center' }}>{asset.description}</p>

      {!showPurchase[asset.id] && !showSell[asset.id] && (
        <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#272626', borderRadius: '10px', margin: '10px' }}>
          <div style={{ margin: '5px' }}>
            <p style={{ fontSize: '14px', color: '#6BFE53', textAlign: 'center' }}>
              {asset.buyPrice} 
              <img src={imali} alt="currency icon" style={{ width: '30px', height: '30px', marginLeft: '5px' }} />
            </p>
            <button className="buttonOne" onClick={() => handlePurchaseClick(asset.id)}>Buy</button>
          </div>
          <div style={{ margin: '5px' }}>
            <p style={{ fontSize: '14px', color: '#6BFE53', textAlign: 'center' }}>
              {asset.sellPrice} 
              <img src={imali} alt="currency icon" style={{ width: '30px', height: '30px', marginLeft: '5px' }} />
              
            </p>
            <button className="buttonOne" onClick={() => handleSellClick(asset.id)} >Sell</button>
          </div>
        </div>
      )}
                      {showPurchase[asset.id] && (
                      <div className="purchase-container">
                        <input
                          className="purchase-input"
                          type="number"
                          value={purchaseAmount[asset.id] || ''}
                          onChange={(e) => handleAmountChange(e, asset.id, asset.buyPrice)}
                          placeholder="Amount"
                        />
                        <table className="purchase-table">
                          <tbody>
                            <tr>
                              <td>Total Price:</td>
                              <td>R {totalPrice[asset.id] || 0}
                              <img 
                                  src={imali} // Path to your logo images
                                  alt="Currency Icon" // Provide a meaningful alt text
                                  style={{ width: '30px', height: '30px', marginLeft: '10px' }} // Adjust size as needed
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <button className="buy-now-button" onClick={() => handleBuyNow(asset.id, asset.name, asset.buyPrice)} disabled={isAssetRequested}>Buy Now</button>
                      </div>
                    )}

          {showSell[asset.id] && (
            <div className="purchase-container">
              <input
                className="sell-input"
                type="number"
                value={sellAmount[asset.id] || ''}
                onChange={(e) => handleAmountChange(e, asset.id, asset.sellPrice, false)}
                placeholder="Amount to Sell"
              />
              
              <table className="purchase-table">
                          <tbody>
                            <tr>
                              <td>Total Price:</td>
                              <td>R {sellTotal[asset.id] || 0} <img 
                                  src={imali} // Path to your logo images
                                  alt="Currency Icon" // Provide a meaningful alt text
                                  style={{ width: '30px', height: '30px', marginLeft: '10px' }} // Adjust size as needed
                                /></td>
                            </tr>
                          </tbody>
                        </table>
              <button className="sell-now-button" onClick={() => handleSellNow(asset.id, asset.name, asset.sellPrice)} disabled={isAssetRequested}>Sell Now</button>
            </div>
          )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;