import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assetPurchaseRequests.css'; // Ensuxre you have a corresponding CSS file
import logo from '../Branding/Tata-iMali-logo-colour-transparent.png';
import { database, firestore } from '../Firebase/config'; // Import the database instance
import { Client, Wallet } from 'xrpl';

function DisplayAssetPurchaseRequests() {
  const [assetPurchases, setAssetPurchases] = useState([]);
  const [showAssetPurchases, setShowAssetPurchases] = useState(false);
  const [password, setPassword] = useState('');
  const [assetSales, setAssetSales] = useState([]);

  useEffect(() => {
    const assetPurchasesRef = database.ref('asset-purchases');
    assetPurchasesRef
      .once('value')
      .then((snapshot) => {
        const purchases = snapshot.val();
        if (purchases) {
          const purchasesArray = Object.entries(purchases).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setAssetPurchases(purchasesArray);
        }
      })
      .catch((error) => {
        console.error('Error fetching asset purchase requests:', error);
      });
  }, []);

  useEffect(() => {
    const assetSalesRef = database.ref('asset-sales');
    assetSalesRef
      .once('value')
      .then((snapshot) => {
        const sales = snapshot.val();
        if (sales) {
          const salesArray = Object.entries(sales).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setAssetSales(salesArray);
        }
      })
      .catch((error) => {
        console.error('Error fetching asset sale requests:', error);
      });
  }, []);

  

  function handlePasswordSubmit() {
    const correctPassword = '12345'; // Replace with your actual password
    if (password === correctPassword) {
      setShowAssetPurchases(true);
    } else {
      toast.error('Invalid password', { autoClose: 3000 });
    }
  }

  async function acceptPurchase(purchase) {
    try {
      const client = new Client('wss://s.altnet.rippletest.net:51233'); // Use appropriate server URL
      await client.connect();
      console.log("Connected to XRPL.");

       // Retrieve the XRPL account from Firestore using the userId from the request
       const userDoc = await firestore.collection('users').doc(purchase.userId).get();
       if (!userDoc.exists) {
           throw new Error("User document not found in Firestore.");
       }
 
       const userXrplAccount = userDoc.data().xrplAddress;
       if (!userXrplAccount) {
           throw new Error("XRPL account address not found for the user.");
       }

       const userXrplKey = userDoc.data().xrplPrivateKey;
       if (!userXrplKey) {
           throw new Error("XRPL account key not found for the user.");
       }

       const userEmail = userDoc.data().email;
       if (!userEmail) {
           throw new Error("User email not found for the user.");
       }

      console.log(userXrplKey)
      console.log(userEmail)
      

      // Wallets for demonstration purposes (replace with actual wallet information)
      const hotWallet = Wallet.fromSeed('sEdTPyCTWtYWeHKqekRS6dVfjcYBqb2'); // Replace 'hotSecret' with actual hot wallet secret
      const borrowerWallet = Wallet.fromSeed(userXrplKey.toString()); // Replace 'borrowerSecret' with actual borrower wallet secret

      


      // Transaction 1: Transfer STX from Hot to Borrower
      const stxTransfer = {
        TransactionType: 'Payment',
        Account: hotWallet.address,
        Destination: userXrplAccount,
        Amount: { // Define the STX amount to transfer
          currency: purchase.assetId.toString(),
          value: purchase.purchaseAmount.toString(),
          issuer: 'rf3wo5pktDqbS8pvJRRztToonuUEn5rGaF'
        }
      };

      const preparedSTX = await client.autofill(stxTransfer);
      const signedSTX = hotWallet.sign(preparedSTX);
      const stxResult = await client.submitAndWait(signedSTX.tx_blob);

    if (stxResult.result.meta.TransactionResult !== "tesSUCCESS") {
      throw new Error(`STX transfer transaction failed: ${stxResult.result.meta.TransactionResult}`);
    }
    console.log("STX transfer transaction succeeded.");

      // Transaction 2: Transfer ZAR from Borrower to Hot
      const zarTransfer = {
        TransactionType: 'Payment',
        Account: userXrplAccount,
        Destination: hotWallet.address,
        DestinationTag: 1,
        Amount: { // Define the STX amount to transfer
            currency: 'ZAR',
            value: purchase.totalPrice.toString(),
            issuer: 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz'
          } 
      };

      const preparedZAR = await client.autofill(zarTransfer);
      const signedZAR = borrowerWallet.sign(preparedZAR);
      await client.submitAndWait(signedZAR.tx_blob);
      console.log("ZAR transfer transaction submitted.");

      const stxResultZAR = await client.submitAndWait(signedSTX.tx_blob);

    if (stxResultZAR.result.meta.TransactionResult !== "tesSUCCESS") {
      throw new Error(`ZAR transfer transaction failed: ${stxResult.result.meta.TransactionResult}`);
    }
    console.log("ZAR transfer transaction succeeded.");

      client.disconnect();
      toast.success('Asset purchase accepted successfully!', { autoClose: 3000 });

      // Removing the request from Firebase
      const assetPurchasesRef = database.ref('asset-purchases');
      await assetPurchasesRef.child(purchase.id).remove();
    } catch (error) {
      console.error('Error accepting asset purchase:', error);
      toast.error('Error processing transaction.', { autoClose: 3000 });
    }
  }

  async function rejectPurchase(request) {
    try {
      const assetPurchasesRef = database.ref('asset-purchases');
      await assetPurchasesRef.child(request.id).remove();
      toast.error('Asset purchase rejected!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error rejecting asset purchase:', error);
    }
  }

  async function rejectSale(request) {
    try {
      const assetSalesRef = database.ref('asset-sales');
      await assetSalesRef.child(request.id).remove();
      toast.error('Asset sale rejected!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error rejecting asset sale:', error);
    }
  }

  if (!showAssetPurchases) {
    return (
      <div className="password-protect-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="password-logo" />
        </div>
        <div className="password-form">
          <h2>Enter Password</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={handlePasswordSubmit} className="password-button">
            Submit
          </button>
        </div>
      </div>
    );
  }

  async function acceptSale(sale) {
    try {
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();
      console.log("Connected to XRPL.");


       // Retrieve the XRPL account from Firestore using the userId from the request
       const userDoc = await firestore.collection('users').doc(sale.userId).get();
       if (!userDoc.exists) {
           throw new Error("User document not found in Firestore.");
       }
 
       const userXrplAccount = userDoc.data().xrplAddress;
       if (!userXrplAccount) {
           throw new Error("XRPL account address not found for the user.");
       }

       const userXrplKey = userDoc.data().xrplPrivateKey;
       if (!userXrplAccount) {
           throw new Error("XRPL account address not found for the user.");
       }

       const userEmail = userDoc.data().email;
       if (!userXrplAccount) {
           throw new Error("XRPL account address not found for the user.");
       }

      console.log(userXrplKey)
      console.log(userEmail)
      

      // Wallets for demonstration purposes (replace with actual wallet information)
      const hotWallet = Wallet.fromSeed('sEdTPyCTWtYWeHKqekRS6dVfjcYBqb2'); // Replace 'hotSecret' with actual hot wallet secret
      const sellerWallet = Wallet.fromSeed(userXrplKey.toString()); 
  
      
      // Transaction 1: Transfer ZAR from Hot to Seller
      const zarTransfer = {
        TransactionType: 'Payment',
        Account: hotWallet.address,
        Destination: sellerWallet.address,
        DestinationTag: 1,
        Amount: {
          currency: 'ZAR',
          value: sale.sellTotal.toString(),
          issuer: 'rPBnJTG63f17dAa7m1Vm43UHNs8Yj8muoz'
        }
      };
  
      const preparedZAR = await client.autofill(zarTransfer);
      const signedZAR = hotWallet.sign(preparedZAR);
      const zarResult = await client.submitAndWait(signedZAR.tx_blob);
  
      if (zarResult.result.meta.TransactionResult !== "tesSUCCESS") {
        throw new Error(`ZAR transfer transaction failed: ${zarResult.result.meta.TransactionResult}`);
      }
      console.log("ZAR transfer transaction succeeded.");
  
      // Transaction 2: Transfer Asset from Seller to Hot
      const assetTransfer = {
        TransactionType: 'Payment',
        Account: sellerWallet.address,
        Destination: hotWallet.address,
        DestinationTag: 1,
        Amount: {
          currency: sale.assetId.toString(),
          value: sale.sellAmount.toString(),
          issuer: 'rf3wo5pktDqbS8pvJRRztToonuUEn5rGaF'
        }
      };
  
      const preparedAsset = await client.autofill(assetTransfer);
      const signedAsset = sellerWallet.sign(preparedAsset);
      const assetResult = await client.submitAndWait(signedAsset.tx_blob);
  
      if (assetResult.result.meta.TransactionResult !== "tesSUCCESS") {
        throw new Error(`Asset transfer transaction failed: ${assetResult.result.meta.TransactionResult}`);
      }
      console.log("Asset transfer transaction succeeded.");
  
      client.disconnect();
      toast.success('Asset sale accepted successfully!', { autoClose: 3000 });
  
      // Remove the sale request from Firebase
      const assetSalesRef = database.ref('asset-sales');
      await assetSalesRef.child(sale.id).remove();
    } catch (error) {
      console.error('Error accepting asset sale:', error);
      toast.error('Error processing transaction.', { autoClose: 3000 });
    }
  }

  return (
    <div className="asset-purchases-view-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="token-logo" />
      </div>
      <h3 className="asset-purchases-heading">Asset Requests</h3>
      <div className="asset-purchase-requests">
        {assetPurchases.map((purchase) => (
          <div key={purchase.id} className="asset-purchase-request">
            <p>Type: Purchase request</p>
            <p>Asset ID: {purchase.assetId}</p>
            <p>Amount: {purchase.purchaseAmount}</p>
            <p>Price: {purchase.totalPrice} ZAR</p>
            <button onClick={() => acceptPurchase(purchase)} className="accept-button">
              Accept
            </button>
            <button onClick={() => rejectPurchase(purchase)} className="reject-button">
              Reject
            </button>
          </div>
        ))}
      </div>
      <div className="asset-purchase-requests">
        {assetSales.map((sale) => (
          <div key={sale.id} className="asset-purchase-request">
            <p >Type: Sale request</p>
            <p>Asset ID: {sale.assetId}</p>
            <p>Amount: {sale.sellAmount}</p>
            <p>Total Price: {sale.sellTotal} ZAR</p>
            <button onClick={() => acceptSale(sale)} className="accept-button">
              Accept
            </button>
            <button onClick={() => rejectSale(sale)} className="reject-button">
              Reject
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default DisplayAssetPurchaseRequests;
